export const onKeyDownFocusTo = (event, elementId) => {
  if (event.key === 'Enter') {
    const element = document.getElementById(elementId).focus();
    if (element) element.focus();
  }
}
