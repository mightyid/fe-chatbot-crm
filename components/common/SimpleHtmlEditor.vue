<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import useMedia from '~/composables/useMedia'
import useEmailTemplateService from '~/composables/controller/useEmailTemplateService'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const htmlContent = ref(props.modelValue || getDefaultTemplate())
const previewMode = ref<'code' | 'preview' | 'split'>('split')
const showLineNumbers = ref(true)
const isUploadingImage = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const { uploadMedia } = useMedia()
const { generateEmailAi } = useEmailTemplateService()
const toast = useToast()

const showAiDialog = ref(false)
const aiPrompt = ref('')
const isAiGenerating = ref(false)

function getDefaultTemplate() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      text-align: center;
    }
    .email-header h1 {
      color: white;
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }
    .email-body {
      padding: 40px;
    }
    .email-body p {
      color: #4a5568;
      font-size: 16px;
      line-height: 1.8;
      margin: 0 0 20px;
    }
    .email-button {
      display: inline-block;
      padding: 14px 32px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 10px;
      transition: background 0.3s;
    }
    .email-button:hover {
      background: #5a67d8;
    }
    .email-footer {
      background: #f7fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .email-footer p {
      color: #a0aec0;
      font-size: 14px;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <h1>🎉 Welcome to Our Newsletter!</h1>
    </div>
    <div class="email-body">
      <p>Hi there,</p>
      <p>Thank you for subscribing to our newsletter! We're thrilled to have you as part of our community.</p>
      <p>Stay tuned for exclusive updates, special offers, and exciting news delivered straight to your inbox.</p>
      <a href="https://example.com" class="email-button">Get Started</a>
    </div>
    <div class="email-footer">
      <p>© 2024 Your Company. All rights reserved.</p>
      <p>You received this email because you subscribed to our newsletter.</p>
    </div>
  </div>
</body>
</html>`
}

watch(
  () => htmlContent.value,
  (newVal) => {
    emit('update:modelValue', sanitizeHtml(newVal))
  },
)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && newVal !== htmlContent.value) {
      htmlContent.value = newVal
    }
  },
)

const previewHtml = computed(() => htmlContent.value)

const lineNumbers = computed(() => {
  const lines = htmlContent.value.split('\n')
  return lines.map((_, i) => i + 1).join('\n')
})

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const previewContent = ref<HTMLElement | null>(null)
let lastCaretPosition: Range | null = null
const lastTextSelection = ref({ start: 0, end: 0 })
const lastFocusedArea = ref<'code' | 'preview'>('preview')
let isSyncing = false
let isInitialLoad = true

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function sanitizeHtml(html: string) {
  if (!html) return ''
  // 1. Remove <script> tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // 2. Remove all on* event handlers (onclick, onload, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*"[^"]*"/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=\s*'[^']*'/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]+/gi, '')

  // 3. Remove javascript: pseudo-protocols
  sanitized = sanitized.replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, 'href="#"')

  return sanitized
}

function saveCaretPosition() {
  lastFocusedArea.value = 'preview'
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    if (previewContent.value && previewContent.value.contains(range.commonAncestorContainer)) {
      lastCaretPosition = range
    }
  }
}

function saveTextSelection() {
  lastFocusedArea.value = 'code'
  if (textareaRef.value) {
    lastTextSelection.value = {
      start: textareaRef.value.selectionStart,
      end: textareaRef.value.selectionEnd,
    }
  }
}

const handleScroll = (e: Event) => {
  // Simple scroll
}

function formatDoc(command: string, value: string | undefined = undefined) {
  if (document.activeElement !== previewContent.value && previewContent.value) {
    previewContent.value.focus()
    if (lastCaretPosition) {
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(lastCaretPosition)
    }
  }
  document.execCommand(command, false, value)
  syncPreviewToCode()
}

function applyLink() {
  const url = prompt('Enter the URL')
  if (url) {
    formatDoc('createLink', url)
  }
}

function insertSnippet(type: string) {
  const snippets: Record<string, string> = {
    heading: `
<div style="padding: 30px; text-align: center;">
  <h2 style="color: #2d3748; font-size: 28px; margin: 0;">Your Heading Here</h2>
</div>`,

    paragraph: `
<div style="padding: 20px 40px;">
  <p style="color: #4a5568; font-size: 16px; line-height: 1.8; margin: 0;">
    Your paragraph text goes here. You can write multiple sentences and format them as needed.
  </p>
</div>`,

    button: `
<div style="padding: 20px 40px; text-align: center;">
  <a href="https://example.com" style="display: inline-block; padding: 14px 32px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
    Click Here
  </a>
</div>`,

    image: `
<div style="padding: 20px 40px; text-align: center;">
  <img src="https://via.placeholder.com/600x300" alt="Image" style="max-width: 100%; height: auto; border-radius: 12px;" />
</div>`,

    divider: `
<div style="padding: 20px 40px;">
  <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 0;" />
</div>`,

    twoColumns: `
<div style="padding: 20px 40px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td width="50%" style="padding-right: 10px; vertical-align: top;">
        <p style="color: #4a5568; font-size: 16px; line-height: 1.8;">Left column content</p>
      </td>
      <td width="50%" style="padding-left: 10px; vertical-align: top;">
        <p style="color: #4a5568; font-size: 16px; line-height: 1.8;">Right column content</p>
      </td>
    </tr>
  </table>
</div>`,
  }

  if (type === 'image') {
    fileInputRef.value?.click()
  } else {
    insertHtmlAtCursor(snippets[type])
  }
}

function onPreviewEdit() {
  if (isSyncing) return
  syncPreviewToCode()
}

async function onGenerateAi() {
  if (!aiPrompt.value.trim()) return
  isAiGenerating.value = true
  try {
    const res: any = await generateEmailAi(aiPrompt.value)
    if (res.result) {
      // Replace existing content with AI generated content
      htmlContent.value = res.result
      aiPrompt.value = ''
      showAiDialog.value = false
      toast.add({
        severity: 'success',
        summary: 'AI Success',
        detail: 'Email content generated successfully',
        life: 3000,
      })
    }
  } catch (error) {
    console.error('AI Generation error:', error)
    toast.add({
      severity: 'error',
      summary: 'AI Error',
      detail: 'Failed to generate content. Please try again.',
      life: 3000,
    })
  } finally {
    isAiGenerating.value = false
  }
}

function onPreviewBlur() {
  saveCaretPosition()
  syncPreviewToCode()
}

function onPreviewClick(event: MouseEvent) {
  saveCaretPosition()

  const target = event.target as HTMLElement
  if (!target || target === previewContent.value || !previewContent.value) return

  // Find which "index" this element is among all elements in the preview
  const allElements = Array.from(previewContent.value.querySelectorAll('*'))
  const elementIndex = allElements.indexOf(target)
  if (elementIndex === -1) return

  const code = htmlContent.value
  const textarea = textareaRef.value
  if (!textarea) return

  // Find the position in the code string by counting tags
  // We'll use a DOMParser to parse the code and find the element at the same index
  const parser = new DOMParser()
  const doc = parser.parseFromString(code, 'text/html')
  const codeElements = Array.from(doc.body.querySelectorAll('*'))
  const targetNodeInCode = codeElements[elementIndex]

  if (!targetNodeInCode) return

  // Now find the start and end of this specific element in the string
  const tagName = target.tagName.toLowerCase()
  const targetTagInParsed = Array.from(doc.body.querySelectorAll(tagName))
  const targetTagIndex = targetTagInParsed.indexOf(targetNodeInCode)

  // Find the byte offset of the N-th occurrence in the raw string
  // Use a more specific regex to avoid partial matches (e.g., <p matching <pre)
  const regex = new RegExp(`<${tagName}(\\s+|>)`, 'gi')
  let match
  let byteIndex = -1
  let currentTagOccurrence = 0

  while ((match = regex.exec(code)) !== null) {
    if (currentTagOccurrence === targetTagIndex) {
      byteIndex = match.index
      break
    }
    currentTagOccurrence++
  }

  if (byteIndex !== -1) {
    if (previewMode.value === 'preview') {
      previewMode.value = 'split'
    }

    nextTick(() => {
      // Use a more stable scroll calculation
      const textBefore = code.substring(0, byteIndex)
      const lineCount = textBefore.split('\n').length

      const style = window.getComputedStyle(textarea)
      const lineHeight = parseFloat(style.lineHeight) || 22.4
      const paddingTop = parseFloat(style.paddingTop) || 20

      const scrollTarget = (lineCount - 1) * lineHeight + paddingTop - textarea.clientHeight / 3

      textarea.scrollTo({
        top: Math.max(0, scrollTarget),
        behavior: 'smooth',
      })

      // Return focus to preview
      if (lastCaretPosition && previewContent.value) {
        previewContent.value.focus()
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(lastCaretPosition)
        }
      }
    })
  }
}

async function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  isUploadingImage.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('acl', 'true')

  try {
    const res: any = await uploadMedia(formData)
    const mediaObj = res?.result || res

    if (mediaObj?.url) {
      const imgHtml = `<div style="padding: 20px 40px; text-align: center;">\n  <img src="${mediaObj?.url}" alt="${mediaObj?.name || 'Image'}" style="max-width: 100%; height: auto; border-radius: 12px;" />\n</div>`
      // Ensure we use the latest saved position before insertion
      nextTick(() => {
        insertHtmlAtCursor(imgHtml)
      })
    } else {
      console.warn('Upload success but no URL found:', res)
    }
  } catch (error) {
    console.error('Upload error:', error)
  } finally {
    isUploadingImage.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

function insertHtmlAtCursor(html: string) {
  if (lastFocusedArea.value === 'preview' && previewContent.value) {
    previewContent.value.focus()
    const selection = window.getSelection()
    if (selection) {
      let range: Range
      if (lastCaretPosition && previewContent.value.contains(lastCaretPosition.commonAncestorContainer)) {
        range = lastCaretPosition
      } else {
        range = document.createRange()
        range.selectNodeContents(previewContent.value)
        range.collapse(false)
      }

      // If we are inserting a block element (like a div) inside a text node,
      // it's better to ensure we are at a point where a block can be inserted.
      // But for simple cases, we just rely on the selection range.
      try {
        range.deleteContents()
      } catch (e) {
        console.warn('Range deletion failed, might be out of sync:', e)
      }

      const el = document.createElement('div')
      el.innerHTML = html
      const fragment = document.createDocumentFragment()
      let node, lastNode
      while ((node = el.firstChild)) {
        lastNode = fragment.appendChild(node)
      }
      range.insertNode(fragment)

      if (lastNode) {
        range = range.cloneRange()
        range.setStartAfter(lastNode)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
        lastCaretPosition = range
      }
      syncPreviewToCode()
    }
  } else {
    const textarea = textareaRef.value
    if (textarea) {
      const start = lastTextSelection.value.start
      const end = lastTextSelection.value.end
      const text = htmlContent.value
      htmlContent.value = text.substring(0, start) + html + text.substring(end)
      nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + html.length, start + html.length)
        saveTextSelection()
      })
    } else {
      htmlContent.value += html
    }
  }
}

let syncTimeout: any = null
function syncPreviewToCode() {
  const isPreviewFocused = document.activeElement === previewContent.value

  if (previewContent.value && !isSyncing && isPreviewFocused) {
    if (syncTimeout) clearTimeout(syncTimeout)
    syncTimeout = setTimeout(() => {
      let previewInner = previewContent.value!.innerHTML

      // Strip out the injected style blocks before syncing back
      previewInner = previewInner.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').trim()

      let newHtml = htmlContent.value

      if (htmlContent.value.includes('<body')) {
        const bodyMatch = htmlContent.value.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
        if (bodyMatch && bodyMatch.index !== undefined) {
          const bodyStart = htmlContent.value.indexOf('>', bodyMatch.index) + 1
          const bodyEnd = htmlContent.value.toLowerCase().lastIndexOf('</body>')

          if (bodyStart !== -1 && bodyEnd !== -1) {
            newHtml = htmlContent.value.substring(0, bodyStart) + previewInner + htmlContent.value.substring(bodyEnd)
          }
        }
      } else {
        newHtml = previewInner
      }

      if (htmlContent.value !== newHtml) {
        isSyncing = true
        htmlContent.value = newHtml
        nextTick(() => {
          isSyncing = false
        })
      }
    }, 150) // Faster sync for better responsiveness
  }
}

// Initial sync on mount
onMounted(() => {
  if (previewContent.value) {
    let displayVal = htmlContent.value
    const bodyMatch = htmlContent.value.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    const styleMatches = htmlContent.value.match(/<style[^>]*>[\s\S]*?<\/style>/gi)

    if (bodyMatch) {
      displayVal = (styleMatches?.join('') || '') + bodyMatch[1]
    }
    previewContent.value.innerHTML = displayVal
    isInitialLoad = false
  }
})

// Watch code changes and update preview
watch(
  () => htmlContent.value,
  (newVal) => {
    if (previewContent.value && !isSyncing) {
      // If full HTML, only show the body content and styles in the editable area
      let displayVal = newVal
      const bodyMatch = newVal.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      const styleMatches = newVal.match(/<style[^>]*>[\s\S]*?<\/style>/gi)

      if (bodyMatch) {
        displayVal = (styleMatches?.join('') || '') + bodyMatch[1]
      }

      // Important: Only update if the content is structurally different
      if (previewContent.value.innerHTML !== displayVal || isInitialLoad) {
        isSyncing = true
        previewContent.value.innerHTML = displayVal
        isInitialLoad = false
        setTimeout(() => {
          isSyncing = false
        }, 50)
      }
    } else if (isInitialLoad && previewContent.value) {
      let displayVal = newVal
      const bodyMatch = newVal.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      const styleMatches = newVal.match(/<style[^>]*>[\s\S]*?<\/style>/gi)

      if (bodyMatch) {
        displayVal = (styleMatches?.join('') || '') + bodyMatch[1]
      }
      previewContent.value.innerHTML = displayVal
      isInitialLoad = false
    }
  },
  { immediate: true },
)

defineExpose({
  getHtml: () => htmlContent.value,
  setHtml: (html: string) => {
    htmlContent.value = html
  },
})

const editorIcons = {
  spinner:
    '<path d="M12 4V2C6.48 2 2 6.48 2 12h2c0-4.41 3.59-8 8-8zm0 16v2c5.52 0 10-4.48 10-10h-2c0 4.41-3.59 8-8 8zm0-16V2c5.52 0 10 4.48 10 10h-2c0-4.41-3.59-8-8-8z" fill="currentColor"/>',
  code: '<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor"/>',
  split: '<path d="M3 5v14h18V5H3zm16 12h-6V7h6v10z" fill="currentColor"/>',
  preview:
    '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>',
  heading: '<path d="M5 4v7h14V4h2v16h-2v-7H5v7H3V4h2z" fill="currentColor"/>',
  paragraph: '<path d="M4 9h16v2H4V9zm0 4h10v2H4v-2zM4 5h16v2H4V5zm0 12h16v2H4v-2z" fill="currentColor"/>',
  button:
    '<path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H5V7h14v10zM17 11H7v2h10v-2z" fill="currentColor"/>',
  image:
    '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>',
  columns: '<path d="M3 5v14h18V5H3zm16 12h-6V7h6v10zM5 7h6v10H5V7z" fill="currentColor"/>',
  undo: '<path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L3 8v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" fill="currentColor"/>',
  redo: '<path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.96 0 3.73.72 5.12 1.88L13 16h9V7l-2.6 2.6z" fill="currentColor"/>',
  bold: '<path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" fill="currentColor"/>',
  italic: '<path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" fill="currentColor"/>',
  underline:
    '<path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" fill="currentColor"/>',
  strike: '<path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zm0 11h14v-3H5v3z" fill="currentColor"/>',
  link: '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="currentColor"/>',
  listBullet:
    '<path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" fill="currentColor"/>',
  listOrder:
    '<path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9v-.9H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" fill="currentColor"/>',
  left: '<path d="M15 15H3v2h12v-2zm0-8H3v2h12v-2zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" fill="currentColor"/>',
  center: '<path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7zM3 3v2h18V3H3z" fill="currentColor"/>',
  right: '<path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-8h12V7H9v2zM3 3v2h18V3H3z" fill="currentColor"/>',
  justify: '<path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" fill="currentColor"/>',
  list: '<path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor"/>',
  ai: '<path d="M11 2L9 7l-5 2l5 2l2 5l2-5l5-2l-5-2V2zM18 14l-1.5 3.5l-3.5 1.5l3.5 1.5L18 22l1.5-3.5l3.5-1.5l-3.5-1.5L18 14z" fill="currentColor"/>',
}
</script>

<template>
  <div class="modern-editor">
    <div class="editor-toolbar">
      <div class="toolbar-section">
        <div class="view-modes">
          <button
            @mousedown.prevent
            @click="previewMode = 'code'"
            :class="{ active: previewMode === 'code' }"
            title="Code View"
          >
            <svg viewBox="0 0 24 24" v-html="editorIcons.code"></svg>
            <span>Code</span>
          </button>
          <button
            @mousedown.prevent
            @click="previewMode = 'split'"
            :class="{ active: previewMode === 'split' }"
            title="Split View"
          >
            <svg viewBox="0 0 24 24" v-html="editorIcons.split"></svg>
            <span>Split</span>
          </button>
          <button
            @mousedown.prevent
            @click="previewMode = 'preview'"
            :class="{ active: previewMode === 'preview' }"
            title="Preview"
          >
            <svg viewBox="0 0 24 24" v-html="editorIcons.preview"></svg>
            <span>Preview</span>
          </button>
        </div>
      </div>

      <div class="toolbar-section divider-left">
        <button @mousedown.prevent @click="showAiDialog = true" class="ai-btn" title="Generate with AI">
          <svg viewBox="0 0 24 24" v-html="editorIcons.ai" class="text-purple-500"></svg>
          <span class="text-purple-600 font-bold px-1">AI Write</span>
        </button>
      </div>

      <div class="toolbar-section divider-left">
        <div class="insert-buttons">
          <button @mousedown.prevent @click="insertSnippet('heading')" title="Insert Heading">
            <svg viewBox="0 0 24 24" v-html="editorIcons.heading"></svg>
            <span>Heading</span>
          </button>
          <button @mousedown.prevent @click="insertSnippet('paragraph')" title="Insert Paragraph">
            <svg viewBox="0 0 24 24" v-html="editorIcons.paragraph"></svg>
            <span>Text</span>
          </button>
          <button @mousedown.prevent @click="insertSnippet('button')" title="Insert Button">
            <svg viewBox="0 0 24 24" v-html="editorIcons.button"></svg>
            <span>Button</span>
          </button>
          <button @mousedown.prevent @click="insertSnippet('image')" title="Insert Image">
            <svg viewBox="0 0 24 24" v-html="editorIcons.image"></svg>
            <span>Image</span>
          </button>
          <button @mousedown.prevent @click="insertSnippet('twoColumns')" title="Insert 2 Columns">
            <svg viewBox="0 0 24 24" v-html="editorIcons.columns"></svg>
            <span>2 Cols</span>
          </button>
        </div>
      </div>

      <div class="toolbar-section divider-left" v-if="previewMode !== 'code'">
        <div class="format-buttons">
          <button @mousedown.prevent @click="formatDoc('undo')" title="Undo">
            <svg viewBox="0 0 24 24" v-html="editorIcons.undo"></svg>
          </button>
          <button @mousedown.prevent @click="formatDoc('redo')" title="Redo">
            <svg viewBox="0 0 24 24" v-html="editorIcons.redo"></svg>
          </button>
        </div>
      </div>

      <div class="toolbar-section divider-left" v-if="previewMode !== 'code'">
        <div class="format-buttons">
          <button @mousedown.prevent @click="formatDoc('bold')" title="Bold">
            <svg viewBox="0 0 24 24" v-html="editorIcons.bold"></svg>
          </button>
          <button @mousedown.prevent @click="formatDoc('italic')" title="Italic">
            <svg viewBox="0 0 24 24" v-html="editorIcons.italic"></svg>
          </button>
          <button @mousedown.prevent @click="formatDoc('underline')" title="Underline">
            <svg viewBox="0 0 24 24" v-html="editorIcons.underline"></svg>
          </button>
          <button @mousedown.prevent @click="formatDoc('strikeThrough')" title="Strikethrough">
            <svg viewBox="0 0 24 24" v-html="editorIcons.strike"></svg>
          </button>
          <button @mousedown.prevent @click="applyLink" title="Link">
            <svg viewBox="0 0 24 24" v-html="editorIcons.link"></svg>
          </button>
        </div>
      </div>

      <div class="toolbar-section divider-left" v-if="previewMode !== 'code'">
        <div class="format-buttons">
          <button @mousedown.prevent @click="formatDoc('insertUnorderedList')" title="Bullet List">
            <svg viewBox="0 0 24 24" v-html="editorIcons.listBullet"></svg>
          </button>
          <button @mousedown.prevent @click="formatDoc('insertOrderedList')" title="Numbered List">
            <svg viewBox="0 0 24 24" v-html="editorIcons.listOrder"></svg>
          </button>
        </div>
      </div>

      <div class="toolbar-section divider-left" v-if="previewMode !== 'code'">
        <div class="format-buttons">
          <button @mousedown.prevent @click="formatDoc('justifyLeft')" title="Align Left">
            <svg viewBox="0 0 24 24" v-html="editorIcons.left"></svg>
          </button>
          <button @mousedown.prevent @click="formatDoc('justifyCenter')" title="Align Center">
            <svg viewBox="0 0 24 24" v-html="editorIcons.center"></svg>
          </button>
          <button @mousedown.prevent @click="formatDoc('justifyRight')" title="Align Right">
            <svg viewBox="0 0 24 24" v-html="editorIcons.right"></svg>
          </button>
          <button @mousedown.prevent @click="formatDoc('justifyFull')" title="Justify">
            <svg viewBox="0 0 24 24" v-html="editorIcons.justify"></svg>
          </button>
        </div>
      </div>

      <div class="toolbar-section">
        <button
          @mousedown.prevent
          @click="showLineNumbers = !showLineNumbers"
          :class="{ active: showLineNumbers }"
          title="Toggle Line Numbers"
        >
          <svg viewBox="0 0 24 24" v-html="editorIcons.list"></svg>
        </button>
      </div>
    </div>

    <div class="editor-content" :class="{ 'split-view': previewMode === 'split' }">
      <div v-show="previewMode !== 'preview'" class="code-panel">
        <div class="code-wrapper">
          <div v-if="showLineNumbers" class="line-numbers">{{ lineNumbers }}</div>
          <textarea
            ref="textareaRef"
            v-model="htmlContent"
            class="html-editor"
            placeholder="Enter your HTML code here..."
            spellcheck="false"
            @focus="lastFocusedArea = 'code'"
            @keyup="saveTextSelection"
            @mouseup="saveTextSelection"
            @blur="saveTextSelection"
          ></textarea>
        </div>
      </div>

      <div v-show="previewMode !== 'code'" class="preview-panel">
        <div class="preview-wrapper">
          <div
            ref="previewContent"
            class="editable-preview"
            contenteditable="true"
            @input="onPreviewEdit"
            @blur="onPreviewBlur"
            @focus="lastFocusedArea = 'preview'"
            @mouseup="saveCaretPosition"
            @keyup="saveCaretPosition"
            @click="onPreviewClick"
          ></div>
        </div>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input type="file" ref="fileInputRef" style="display: none" accept="image/*" @change="handleImageUpload" />

    <div v-if="isUploadingImage" class="uploading-overlay">
      <div class="uploading-card">
        <svg viewBox="0 0 24 24" class="animate-spin" v-html="editorIcons.spinner"></svg>
        <span>Uploading image...</span>
      </div>
    </div>

    <!-- AI Generation Dialog -->
    <Dialog v-model:visible="showAiDialog" header="AI Email Assistant" :style="{ width: '500px' }" modal>
      <div class="fc gap-4 py-2">
        <label class="font-bold text-sm text-gray-600">What would you like to write?</label>
        <Textarea
          v-model="aiPrompt"
          placeholder="e.g. Write a welcome email for new subscribers with a 20% discount code..."
          rows="4"
          class="w-full border-gray-200"
        />
        <small class="text-gray-400 italic">AI will generate the HTML content for your email.</small>
      </div>
      <template #footer>
        <Button label="Cancel" severity="secondary" text @click="showAiDialog = false" />
        <Button label="Generate Content" :loading="isAiGenerating" @click="onGenerateAi" icon="pi pi-sparkles" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.modern-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 10px 16px;
  background: #2d2d30;
  border-bottom: 2px solid #007acc;
  overflow-x: auto;
}

.toolbar-section {
  display: flex;
  gap: 6px;
  align-items: center;
}

.divider-left {
  border-left: 1px solid #454545;
  padding-left: 12px;
  margin-left: 4px;
}

.view-modes,
.insert-buttons,
.format-buttons {
  display: flex;
  gap: 4px;
  background: #3e3e42;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid #454545;
}

.view-modes button,
.insert-buttons button,
.format-buttons button,
.toolbar-section > button {
  padding: 6px 12px;
  background: #2d2d30;
  border: 1px solid #454545;
  border-radius: 6px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.view-modes button svg,
.insert-buttons button svg,
.format-buttons button svg,
.toolbar-section > button svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
  display: block;
}

.view-modes button,
.insert-buttons button,
.format-buttons button,
.toolbar-section > button {
  color: #ffffff;
}

.view-modes button:hover,
.insert-buttons button:hover,
.format-buttons button:hover,
.toolbar-section > button:hover {
  background: #4e4e4e;
  border-color: #666666;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.view-modes button.active,
.toolbar-section > button.active {
  background: #007acc;
  border-color: #0098ff;
  color: #ffffff;
}

.view-modes button.active svg {
  opacity: 1;
}

.editor-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-content.split-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.code-panel,
.preview-panel {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.code-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.line-numbers {
  padding: 20px 12px;
  background: #1e1e1e;
  color: #858585;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  text-align: right;
  user-select: none;
  border-right: 1px solid #3e3e42;
  overflow-y: hidden;
  white-space: pre;
}

.html-editor {
  flex: 1;
  padding: 20px;
  border: none;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  background: #1e1e1e;
  color: #d4d4d4;
  tab-size: 2;
}

.html-editor::selection {
  background: #264f78;
}

.ai-btn {
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%) !important;
  border: 1px solid #ddd6fe !important;
  padding: 0 12px !important;
  margin: 0 4px;
}

.ai-btn:hover {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%) !important;
  border-color: #c4b5fd !important;
}

.ai-btn svg {
  filter: drop-shadow(0 0 2px rgba(139, 92, 246, 0.3));
}

.preview-wrapper {
  flex: 1;
  background: #f5f5f5;
  overflow: auto;
  border-left: 1px solid #3e3e42;
  padding: 20px;
}

.editable-preview {
  min-height: 100%;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  outline: none;
}

.editable-preview:focus {
  box-shadow: 0 0 0 2px #0e639c;
}

/* Scrollbar styling */
.html-editor::-webkit-scrollbar,
.preview-wrapper::-webkit-scrollbar,
.editor-toolbar::-webkit-scrollbar {
  width: 10px;
  height: 8px;
}

.html-editor::-webkit-scrollbar-track,
.preview-wrapper::-webkit-scrollbar-track,
.editor-toolbar::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.html-editor::-webkit-scrollbar-thumb,
.preview-wrapper::-webkit-scrollbar-thumb,
.editor-toolbar::-webkit-scrollbar-thumb {
  background: #424242;
  border-radius: 6px;
}

.html-editor::-webkit-scrollbar-thumb:hover,
.preview-wrapper::-webkit-scrollbar-thumb:hover,
.editor-toolbar::-webkit-scrollbar-thumb:hover {
  background: #4e4e4e;
}

.uploading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.uploading-card {
  background: #252526;
  padding: 24px 48px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
</style>
