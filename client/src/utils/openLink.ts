function openLink() :void {
  const action = window.open(this, '_blank');

  if (action && action.focus) {
    action.focus();
  } else if (!action) {
    window.location.href = this;
  }
}
export default openLink;
