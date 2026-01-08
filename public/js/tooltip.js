const tooltips = document.querySelectorAll('.info');

tooltips.forEach(info => {
    new bootstrap.Tooltip(info);
});