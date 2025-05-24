/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js'
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js'
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js'
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js'
import Image from '@ckeditor/ckeditor5-image/src/image.js'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js'
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert.js'
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize.js'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import StrikeThrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
import Link from '@ckeditor/ckeditor5-link/src/link.js'
import List from '@ckeditor/ckeditor5-list/src/list.js'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js'
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting.js'
import Table from '@ckeditor/ckeditor5-table/src/table.js'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js'

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
  Alignment,
  Autoformat,
  BlockQuote,
  Bold,
  Essentials,
  FontBackgroundColor,
  FontColor,
  Heading,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Italic,
  Underline,
  StrikeThrough,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  SourceEditing,
  Table,
  TableToolbar,
  TextTransformation,
]

// Editor configuration.
Editor.defaultConfig = {
  toolbar: {
    items: [
      'undo',
      'redo',
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'fontBackgroundColor',
      'fontColor',
      'bulletedList',
      'numberedList',
      'alignment',
      '|',
      'imageUpload',
      'mediaEmbed',
      'link',
      'blockQuote',
      'insertTable',
      'sourceEditing',
    ],
  },
  language: 'en',
  image: {
    toolbar: ['imageTextAlternative', 'toggleImageCaption', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side'],
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
      { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
    ],
  },
}

export default Editor
