// js/include.js
function includeHTML(callback) {
    const elements = document.querySelectorAll('[include-html]');
    let remaining = elements.length;

    if (remaining === 0) {
        callback?.();
        return;
    }

    elements.forEach(el => {
        const file = el.getAttribute('include-html');
        fetch(file)
            .then(response => {
                if (!response.ok) throw new Error('Include not found: ' + file);
                return response.text();
            })
            .then(data => {
                el.innerHTML = data;
                el.removeAttribute('include-html');
                remaining--;
                if (remaining === 0) callback?.();
            })
            .catch(err => {
                el.innerHTML = `<div style="color:red;">Error loading ${file}</div>`;
                remaining--;
                if (remaining === 0) callback?.();
            });
    });
}
