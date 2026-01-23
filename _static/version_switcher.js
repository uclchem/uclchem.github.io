// Version Switcher for Multi-Version Documentation
(function() {
    'use strict';
    
    // Add version banner to page
    function createVersionBanner() {
        const banner = document.createElement('div');
        banner.id = 'version-banner';
        banner.style.cssText = `
            background: #f5f5f5;
            border-bottom: 1px solid #ddd;
            padding: 4px 10px;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        const label = document.createElement('span');
        label.textContent = 'Version:';
        
        const select = document.createElement('select');
        select.id = 'version-select';
        select.style.cssText = `
            padding: 2px 4px;
            font-size: 13px;
            border: 1px solid #999;
            background: white;
        `;
        
        const loadingOption = document.createElement('option');
        loadingOption.value = '';
        loadingOption.textContent = 'Loading...';
        select.appendChild(loadingOption);
        
        banner.appendChild(label);
        banner.appendChild(select);
        
        // Insert after navbar instead of at top of body
        const navbar = document.querySelector('nav.bd-navbar') || document.querySelector('header') || document.body.firstChild;
        if (navbar && navbar.nextSibling) {
            navbar.parentNode.insertBefore(banner, navbar.nextSibling);
        } else {
            document.body.insertBefore(banner, document.body.firstChild);
        }
        
        return select;
    }
    
    const versionSwitcher = {
        versionsData: null,
        currentVersion: null,
        selectElement: null,
        
        init: function() {
            // Create banner and get select element
            this.selectElement = createVersionBanner();
            
            // Detect current version
            this.detectCurrentVersion();
            
            // Load versions data
            this.loadVersions();
            
            // Add change handler
            this.selectElement.addEventListener('change', (e) => {
                this.switchVersion(e.target.value);
            });
        },
        
        detectCurrentVersion: function() {
            const path = window.location.pathname;
            const match = path.match(/\/(develop|v[\d.]+)\//);
            this.currentVersion = match ? match[1] : null;
            console.log('Current version:', this.currentVersion);
        },
        
        loadVersions: function() {
            fetch('/versions.json')
                .then(response => {
                    if (!response.ok) throw new Error('Failed to load versions.json');
                    return response.json();
                })
                .then(data => {
                    // Handle both array format (new) and object format (old)
                    this.versionsData = Array.isArray(data) ? data : data.versions;
                    this.populateDropdown();
                })
                .catch(error => {
                    console.error('Failed to load versions:', error);
                    this.selectElement.innerHTML = '<option>Version info unavailable</option>';
                });
        },
        
        populateDropdown: function() {
            this.selectElement.innerHTML = '';
            
            this.versionsData.forEach(version => {
                const option = document.createElement('option');
                option.value = version.version;
                option.textContent = version.name;
                
                if (version.version === this.currentVersion) {
                    option.selected = true;
                }
                
                this.selectElement.appendChild(option);
            });
        },
        
        switchVersion: function(newVersion) {
            if (!newVersion || newVersion === this.currentVersion) {
                return;
            }
            
            let currentPath = window.location.pathname;
            
            // Remove current version from path
            if (this.currentVersion) {
                currentPath = currentPath.replace(new RegExp('/' + this.currentVersion + '(/|$)'), '/');
            }
            
            // Ensure path starts with /
            if (!currentPath.startsWith('/')) {
                currentPath = '/' + currentPath;
            }
            
            // Build new URL
            const newUrl = window.location.origin + '/' + newVersion + currentPath;
            console.log('Switching to:', newUrl);
            window.location.href = newUrl;
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => versionSwitcher.init());
    } else {
        versionSwitcher.init();
    }
})();
