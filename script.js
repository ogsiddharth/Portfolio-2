/* ========================
   CANVAS: STARS & LIGHTNING ⚡
   ======================== */
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let width, height;
let stars = [];
let lightnings = []; // Store active lightning bolts
const numStars = 200;

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();





// --- Star Class ---
class Star {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }
    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < numStars; i++) stars.push(new Star());

// --- Lightning Class ---
class Lightning {
    constructor() {
        this.startX = Math.random() * width;
        this.startY = 0; // Start from top
        this.path = [];
        this.isAlive = true;
        this.life = 0;
        this.generatePath(this.startX, this.startY, 10); // 10 is segment length
    }

    generatePath(x, y, segmentLen) {
        this.path.push({x, y});
        // Stop if we hit bottom
        if (y > height) return;

        // Random jagged movement downwards
        const xOffset = (Math.random() - 0.5) * 50; // Left/right zigzag
        const yOffset = Math.random() * 30 + 10; // Always go down
        this.generatePath(x + xOffset, y + yOffset, segmentLen);
        
        // Small chance to branch out
        if (Math.random() > 0.95) {
                this.generatePath(x + xOffset*1.5, y + yOffset*0.5, segmentLen);
        }
    }

    update() {
        this.life++;
        // Lightning only lasts for 10 frames
        if (this.life > 10) {
            this.isAlive = false;
        }
    }

    draw() {
        if (this.path.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        // White core with neon glow
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(100, 255, 218, 0.8)'; // Neon Cyan Glow
        ctx.stroke();
        // Reset shadow for next drawings
        ctx.shadowBlur = 0; 
    }
}

// Trigger lightning at random intervals
function triggerLightning() {
    lightnings.push(new Lightning());
    // Random time between 3s and 10s
    const nextStrikeTime = Math.random() * (10000 - 3000) + 3000;
    setTimeout(triggerLightning, nextStrikeTime);
}
// Start after 3 seconds
setTimeout(triggerLightning, 3000);


// Main Animation Loop
function animate() {
    // Clear canvas with transparent black for trails
    ctx.fillStyle = 'rgba(11, 13, 23, 0.4)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw Stars
    stars.forEach(star => { star.update(); star.draw(); });

    // Draw Lightnings
    lightnings.forEach((bolt, index) => {
        if (bolt.isAlive) {
            bolt.update();
            bolt.draw();
        } else {
            lightnings.splice(index, 1); // Remove dead bolts
        }
    });

    requestAnimationFrame(animate);
}
animate();

/* Typing Effect */
const textElement = document.getElementById('typing-text');
const texts = ["I build fast web apps", "I design beautiful UIs", "I solve complex problems"];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';

(function type() {
    if (count === texts.length) count = 0;
    currentText = texts[count];
    letter = currentText.slice(0, ++index);
    textElement.textContent = letter;
    if (letter.length === currentText.length) {
        setTimeout(() => { count++; index = 0; }, 2000);
    }
    setTimeout(type, 150);
})();

/* Scroll Reveal */
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

/* 3D Tilt */
const cards = document.querySelectorAll('.tilt-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
    });
});

/* Mobile Menu */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

/* Navbar Scroll Effect */
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

/* Copy Email */
const copyBtn = document.getElementById('copy-email');
copyBtn.addEventListener('click', () => {
    const email = "contact@siddharth.dev"; 
    navigator.clipboard.writeText(email).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
    });
});




/* ========================
   SCROLL ANIMATIONS & BLACK HOLE TRIGGER 🚀🌍🕳️
   ======================== */

const earthContainer = document.getElementById('earth-container');
const rocketContainer = document.getElementById('rocket-container');
const footer = document.querySelector('.footer-detailed');

function updateSpaceAssets() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.body.scrollHeight - windowHeight;
    const scrollPercent = scrollY / docHeight;

    // --- Calculate Trigger Point ---
    // Footer ka top position pata karo
    const footerTop = footer.offsetTop;
    // Trigger point: Jab screen ka bottom hissa footer ke top ko touch kare
    // Thoda sa buffer (-100px) diya hai taaki effect jaldi shuru ho
    const triggerPoint = footerTop - windowHeight + 100;

    // --- CHECK: Are we near the Black Hole? ---
    if (scrollY > triggerPoint) {
        // YES: Footer aa gaya! Fall in mode activate karo.
        if (!earthContainer.classList.contains('is-falling')) {
            earthContainer.classList.add('is-falling');
            rocketContainer.classList.add('is-falling');
            
            // Optional: Rocket ka smoke band kar do jab woh gir raha ho
            document.querySelector('.exhaust-fumes').style.display = 'none';
            document.querySelector('.exhaust-flame').style.display = 'none';
        }
    } else {
        // NO: Abhi upar hain. Normal scrolling mode.
        // Agar 'is-falling' class lagi hai to hata do (agar user wapas upar scroll kare)
        if (earthContainer.classList.contains('is-falling')) {
            earthContainer.classList.remove('is-falling');
            rocketContainer.classList.remove('is-falling');
            // Smoke wapas on karo
            document.querySelector('.exhaust-fumes').style.display = 'block';
            document.querySelector('.exhaust-flame').style.display = 'block';
        }

        // --- NORMAL SCROLL LOGIC (Jab tak gire nahi) ---
        
        // Earth Parallax
        earthContainer.style.transform = `translateY(${scrollY * 0.15}px)`;

        // Rocket Path
        const rocketTop = 10 + (scrollPercent * 80); 
        const rocketLeft = 50 + (Math.sin(scrollY * 0.0025) * 35); 
        const rotation = (Math.cos(scrollY * 0.0025) * 15);

        rocketContainer.style.top = `${rocketTop}%`;
        rocketContainer.style.left = `${rocketLeft}%`;
        rocketContainer.style.transform = `rotate(${rotation}deg)`;
    }
}

// Scroll aur Load dono par check karo
window.addEventListener('scroll', updateSpaceAssets);
window.addEventListener('load', updateSpaceAssets);







/* ========================
   INTERACTIVE EARTH ROTATION 🌍👆
   ======================== */

const earthImage = document.getElementById('earth-img');
const earthWrapper = document.getElementById('earth-container');

// Jab mouse Earth ke upar move kare
earthWrapper.addEventListener('mousemove', (e) => {
    // Earth ka center point nikalna
    const rect = earthWrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Mouse center se kitna door hai (X aur Y axis par)
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Rotation calculate karna (Divide by 5 to reduce speed)
    // RotateY: Left-Right ghumane ke liye
    // RotateX: Up-Down tilt karne ke liye (Inverse (-) taaki natural lage)
    const rotateY = mouseX / 5; 
    const rotateX = -(mouseY / 5);

    // Transform apply karna (3D look ke liye perspective zaroori hai)
    earthImage.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.1)`;
});

// Jab mouse Earth se hatt jaye, to wapas normal ho jaye
earthWrapper.addEventListener('mouseleave', () => {
    // Rotation hata do taaki wapas CSS animation (Gol ghumna) shuru ho jaye
    earthImage.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
});








