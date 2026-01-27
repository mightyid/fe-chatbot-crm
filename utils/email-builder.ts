const renderBlock = (block: any): string => {
  switch (block.type) {
    case 'text':
    case 'heading':
      return `
        <div class="block" style="padding: ${block.style.padding || '10px 40px'}; color: ${block.style.color}; font-size: ${block.style.fontSize}; font-weight: ${block.style.fontWeight}; text-align: ${block.style.textAlign}; line-height: ${block.style.lineHeight || '1.6'};">
          ${block.content.replace(/\n/g, '<br>')}
        </div>`
    case 'image':
      return `
        <div class="block" style="text-align: center; padding: ${block.style.padding || '0'};">
          <img src="${block.url}" style="width: ${block.style.width || '100%'}; border-radius: ${block.style.borderRadius || '0px'};" alt="Email Media" />
        </div>`
    case 'button':
      return `
        <div class="block" style="text-align: ${block.style.textAlign || 'center'}; padding: 20px 40px 40px 40px;">
          <a href="${block.url}" style="background-color: ${block.style.backgroundColor}; color: ${block.style.color}; padding: ${block.style.padding}; border-radius: ${block.style.borderRadius}; font-weight: ${block.style.fontWeight}; font-size: 14px; text-transform: uppercase;">
            ${block.text}
          </a>
        </div>`
    case 'divider':
      return `<div class="block" style="height: ${block.style.height || '1px'}; background-color: ${block.style.backgroundColor || '#e2e8f0'}; margin: ${block.style.margin || '24px 0'};"></div>`
    case 'social':
      let socialHtml = `<div class="block" style="padding: 20px; text-align: center;">`
      block.platforms.forEach((p: any) => {
        socialHtml += `<a href="${p.url}" style="margin: 0 8px; color: #3b82f6; font-weight: bold; font-size: 12px;">${p.name.toUpperCase()}</a>`
      })
      socialHtml += `</div>`
      return socialHtml
    case 'menu':
      let menuHtml = `<div class="block" style="padding: 15px; text-align: center;">`
      block.items.forEach((i: any) => {
        menuHtml += `<a href="${i.url}" style="margin: 0 15px; color: #333; font-weight: bold; font-size: 14px;">${i.label}</a>`
      })
      menuHtml += `</div>`
      return menuHtml
    case 'html':
      return `<div class="block" style="padding: 20px;">${block.content}</div>`
    case 'columns':
      let colsHtml = `<div class="block" style="display: table; width: 100%; border-collapse: collapse;">`
      block.cols.forEach((col: number, idx: number) => {
        const width = (col / block.cols.reduce((a: number, b: number) => a + b, 0)) * 100
        colsHtml += `<div style="display: table-cell; width: ${width}%; vertical-align: top;">`
        if (block.children && block.children[idx]) {
          block.children[idx].forEach((child: any) => {
            colsHtml += renderBlock(child)
          })
        }
        colsHtml += `</div>`
      })
      colsHtml += `</div>`
      return colsHtml
    default:
      return ''
  }
}

export const generateEmailHtml = (blocks: any[]) => {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7f9; }
        .wrapper { width: 100%; background-color: #f4f7f9; padding: 40px 0; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow: hidden; }
        .block { overflow: hidden; }
        img { display: block; height: auto; border: 0; max-width: 100%; }
        a { text-decoration: none; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div style="padding: 40px; text-align: center; border-bottom: 1px solid #f0f0f0;">
             <h1 style="font-family: serif; font-style: italic; color: #333; font-size: 32px; margin: 0;">your logo.</h1>
          </div>
  `

  blocks.forEach((block) => {
    html += renderBlock(block)
  })

  html += `
          <div style="padding: 40px; background-color: #fafafa; text-align: center; color: #ccc; font-size: 12px; border-top: 1px solid #f0f0f0;">
             <p style="margin: 0;">Powered by Mighty CRM System</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
  return html
}
