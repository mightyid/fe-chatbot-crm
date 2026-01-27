<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const htmlContent = ref(props.modelValue || getDefaultTemplate())
const previewMode = ref<'code' | 'preview' | 'split'>('split')
const showLineNumbers = ref(true)

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
let isUpdatingFromCode = false
let isInitialLoad = true

function sanitizeHtml(html: string) {
  if (!html) return ''
  // 1. Remove <script> tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // 2. Remove all on* event handlers (onclick, onload, etc.)
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '')
  sanitized = sanitized.replace(/on\w+='[^']*'/gi, '')
  sanitized = sanitized.replace(/on\w+=[^\s>]+/gi, '')

  // 3. Remove javascript: pseudo-protocols
  sanitized = sanitized.replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, 'href="#"')
  sanitized = sanitized.replace(/src\s*=\s*["']\s*javascript:[^"']*["']/gi, 'src=""')

  return sanitized
}

function saveCaretPosition() {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    // Only save if inside the preview area
    if (previewContent.value && previewContent.value.contains(range.commonAncestorContainer)) {
      lastCaretPosition = range
    }
  }
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

  const snippet = snippets[type]

  // Detect if we should insert into preview or code
  const isFocusedOnPreview =
    document.activeElement === previewContent.value || (previewMode.value !== 'code' && lastCaretPosition)

  if (isFocusedOnPreview && previewContent.value) {
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

      range.deleteContents()
      const el = document.createElement('div')
      el.innerHTML = snippet
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
    // Insert into textarea
    const textarea = textareaRef.value
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = htmlContent.value
      htmlContent.value = text.substring(0, start) + snippet + text.substring(end)

      nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + snippet.length, start + snippet.length)
      })
    } else {
      htmlContent.value += snippet
    }
  }
}

function onPreviewEdit() {
  if (isUpdatingFromCode) return
  syncPreviewToCode()
}

function syncPreviewToCode() {
  if (previewContent.value && !isUpdatingFromCode) {
    const newHtml = sanitizeHtml(previewContent.value.innerHTML)
    if (htmlContent.value !== newHtml) {
      htmlContent.value = newHtml
    }
  }
}

// Initial sync on mount
onMounted(() => {
  if (previewContent.value) {
    previewContent.value.innerHTML = htmlContent.value
    isInitialLoad = false
  }
})

// Watch code changes and update preview
watch(
  () => htmlContent.value,
  (newVal) => {
    if (previewContent.value && (previewContent.value.innerHTML !== newVal || isInitialLoad)) {
      isUpdatingFromCode = true
      if (document.activeElement !== previewContent.value || isInitialLoad) {
        previewContent.value.innerHTML = newVal
        isInitialLoad = false
      }
      nextTick(() => {
        isUpdatingFromCode = false
      })
    }
  },
)

defineExpose({
  getHtml: () => htmlContent.value,
  setHtml: (html: string) => {
    htmlContent.value = html
  },
})
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
            <i class="pi pi-code"></i>
            <span>Code</span>
          </button>
          <button
            @mousedown.prevent
            @click="previewMode = 'split'"
            :class="{ active: previewMode === 'split' }"
            title="Split View"
          >
            <i class="pi pi-th-large"></i>
            <span>Split</span>
          </button>
          <button
            @mousedown.prevent
            @click="previewMode = 'preview'"
            :class="{ active: previewMode === 'preview' }"
            title="Preview"
          >
            <i class="pi pi-eye"></i>
            <span>Preview</span>
          </button>
        </div>
      </div>

      <div class="toolbar-section divider-left">
        <div class="insert-buttons">
          <button @mousedown.prevent @click="insertSnippet('heading')" title="Insert Heading">
            <i class="pi pi-align-center"></i>
            <span>Heading</span>
          </button>
          <button @mousedown.prevent @click="insertSnippet('paragraph')" title="Insert Paragraph">
            <i class="pi pi-align-left"></i>
            <span>Text</span>
          </button>
          <button @mousedown.prevent @click="insertSnippet('button')" title="Insert Button">
            <i class="pi pi-link"></i>
            <span>Button</span>
          </button>
          <button @mousedown.prevent @click="insertSnippet('image')" title="Insert Image">
            <i class="pi pi-image"></i>
            <span>Image</span>
          </button>
          <button @mousedown.prevent @click="insertSnippet('twoColumns')" title="Insert 2 Columns">
            <i class="pi pi-table"></i>
            <span>2 Cols</span>
          </button>
        </div>
      </div>

      <div class="toolbar-section divider-left" v-if="previewMode !== 'code'">
        <div class="format-buttons">
          <button @mousedown.prevent @click="formatDoc('bold')" title="Bold">
            <i class="pi pi-bold"></i>
          </button>
          <button @mousedown.prevent @click="formatDoc('italic')" title="Italic">
            <i class="pi pi-italic"></i>
          </button>
          <button @mousedown.prevent @click="applyLink" title="Link">
            <i class="pi pi-link"></i>
          </button>
          <button @mousedown.prevent @click="formatDoc('justifyLeft')" title="Align Left">
            <i class="pi pi-align-left"></i>
          </button>
          <button @mousedown.prevent @click="formatDoc('justifyCenter')" title="Align Center">
            <i class="pi pi-align-center"></i>
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
          <i class="pi pi-list"></i>
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
            @blur="syncPreviewToCode"
            @mouseup="saveCaretPosition"
            @keyup="saveCaretPosition"
          ></div>
        </div>
      </div>
    </div>
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
  gap: 16px;
  padding: 8px 16px;
  background: #252526;
  border-bottom: 1px solid #3e3e42;
  overflow-x: auto;
}

.toolbar-section {
  display: flex;
  gap: 8px;
  align-items: center;
}

.divider-left {
  border-left: 1px solid #3e3e42;
  padding-left: 16px;
}

.view-modes,
.insert-buttons,
.format-buttons {
  display: flex;
  gap: 4px;
  background: #1e1e1e;
  padding: 4px;
  border-radius: 8px;
}

.view-modes button,
.insert-buttons button,
.format-buttons button,
.toolbar-section > button {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: #cccccc;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.view-modes button:hover,
.insert-buttons button:hover,
.format-buttons button:hover,
.toolbar-section > button:hover {
  background: #2d2d30;
  border-color: #3e3e42;
  color: #ffffff;
}

.view-modes button.active,
.toolbar-section > button.active {
  background: #0e639c;
  border-color: #0e639c;
  color: #ffffff;
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
</style>
