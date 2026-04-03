// Component Loader
function loadComponent(elementId, componentPath) {
    return fetch(componentPath)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const componentContent = doc.body.innerHTML;

            document.getElementById(elementId).innerHTML = componentContent;

            // Inject styles from component head
            const styles = doc.querySelectorAll('head style');
            styles.forEach(style => {
                const newStyle = document.createElement('style');
                newStyle.textContent = style.textContent;
                document.head.appendChild(newStyle);
            });

            // Inject link tags from component head (e.g. favicon)
            const links = doc.querySelectorAll('head link');
            links.forEach(link => {
                const rel = link.getAttribute('rel') || '';
                const sizes = link.getAttribute('sizes') || '';
                if (rel.includes('icon')) {
                    if (!document.querySelector(`link[rel="${rel}"][sizes="${sizes}"]`)) {
                        const newLink = document.createElement('link');
                        Array.from(link.attributes).forEach(attr => newLink.setAttribute(attr.name, attr.value));
                        document.head.appendChild(newLink);
                    }
                }
            });

            // Execute any scripts in the component
            const scripts = doc.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.head.appendChild(newScript);
            });
        })
        .catch(error => console.error('Error loading component:', error));
}

// Set active nav item based on current page
function setActiveNavItem() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.navbar-item, .navbar-mobile-item');

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Load navbar and footer on page load
document.addEventListener('DOMContentLoaded', function() {
    const loads = [
        loadComponent('navbar-container', 'components/navbar.html'),
        loadComponent('footer-container', 'components/footer.html')
    ];

    if (document.getElementById('background-container')) {
        loads.push(loadComponent('background-container', 'components/background.html'));
    }

    Promise.all(loads).then(() => {
        setActiveNavItem();
    });
});
