class MobileNavbar {
    constructor(mobileMenu, menuDesktop, navLinks) {
        this.mobileMenu = document.querySelector(mobileMenu);
        this.menuDesktop = document.querySelector(menuDesktop);
        this.navLinks = document.querySelectorAll(navLinks);
        this.activeClass = "active";
    
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.menuDesktop) {
            this.menuDesktop.classList.toggle(this.activeClass);
            this.animateLinks();
        } else {
            console.error('menuDesktop element not found');
        }
    }
    
    animateLinks(){
        this.navLinks.forEach((link) => {
            link.style.animation ? (link.style.animation = "") : (link.style.animation = `navLinkFade 0.5s ease forwards 0.3s`);
        });
    }

    addClickEvent() {
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener("click", this.handleClick);
        } else {
            console.error('mobileMenu element not found');
        }
    }

    init() {
        if (this.mobileMenu) {
            this.addClickEvent();
        }
        return this;
    }
}

// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const mobileNavbar = new MobileNavbar(
        ".mobile-menu",
        ".menu-desktop",
        ".nav-list li"
    );
    mobileNavbar.init();
});
