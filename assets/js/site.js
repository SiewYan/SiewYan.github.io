// Email: the address is assembled here so it is not left in the markup for scrapers.
(function () {
  var link = document.getElementById('email-link');
  var button = document.getElementById('copy-email');
  var label = document.getElementById('copy-email-label');
  if (!link) return;

  var address = link.dataset.user + '@' + link.dataset.domain;
  link.textContent = address;
  link.href = 'mailto:' + address;

  if (!button || !label) return;

  var flash = function (text) {
    label.textContent = text;
    setTimeout(function () { label.textContent = 'Copy'; }, 2000);
  };

  var selectInstead = function () {
    var range = document.createRange();
    range.selectNodeContents(link);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    flash('Selected');
  };

  button.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address).then(function () { flash('Copied'); }, selectInstead);
    } else {
      selectInstead();
    }
  });
})();
