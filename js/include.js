// File: js/include.js (Corrected Version)

function includeHTML(callback) {
    const elements = document.querySelectorAll('[include-html]');
    const promises = [];

    if (elements.length === 0) {
        if (callback) callback();
        return;
    }

    elements.forEach(el => {
        const file = el.getAttribute('include-html');
        const promise = fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok for file: ' + file);
                }
                return response.text();
            })
            .then(data => {
                el.innerHTML = data;
                el.removeAttribute('include-html');

                
                // Find all script tags in the loaded HTML and execute them
                const scripts = el.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    // Copy all attributes
                    for (let i = 0; i < script.attributes.length; i++) {
                        newScript.setAttribute(script.attributes[i].name, script.attributes[i].value);
                    }
                    // Copy the script content
                    newScript.innerHTML = script.innerHTML;
                    // Replace the old script tag with the new one to trigger execution
                    script.parentNode.replaceChild(newScript, script);
                });
               
            })
            .catch(err => {
                console.error('Error loading partial:', err);
                el.innerHTML = `<div style="color:red;">Error loading ${file}</div>`;
            });
        
        promises.push(promise);
    });

    // Wait for all fetch operations to complete, then call the callback
    Promise.all(promises).then(() => {
        if (callback) callback();
    });
}