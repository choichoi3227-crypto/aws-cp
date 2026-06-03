const textarea = document.querySelector('#body_html');
const insert = (before, after = '') => {
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || '내용';
  textarea.setRangeText(`${before}${selected}${after}`, start, end, 'end');
  textarea.focus();
};
document.querySelectorAll('.editor-toolbar button').forEach((button) => {
  button.addEventListener('click', () => {
    const tag = button.dataset.tag;
    if (tag === 'a') return insert('<a href="https://">', '</a>');
    if (tag) return insert(`<${tag}>`, `</${tag}>`);
    if (button.dataset.wrap === 'ul') return insert('<ul>\n<li>', '</li>\n</ul>');
    if (button.dataset.insert === 'table') return insert('<table><thead><tr><th>항목</th></tr></thead><tbody><tr><td>내용</td></tr></tbody></table>');
    if (button.dataset.class) return insert(`<span class="${button.dataset.class}">`, '</span>');
  });
});
