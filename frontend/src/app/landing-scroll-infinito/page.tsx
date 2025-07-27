'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function LandingScrollInfinito() {
  useEffect(() => {
    const initAnimation = () => {
      if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger && window.SplitType) {
        window.gsap.registerPlugin(window.ScrollTrigger)

        // Configurar cursor personalizado
        const cursor = document.querySelector('.custom-cursor')
        const cursorFollower = document.querySelector('.cursor-follower')

        document.addEventListener('mousemove', (e) => {
          cursor.style.left = e.clientX + 'px'
          cursor.style.top = e.clientY + 'px'

          setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px'
            cursorFollower.style.top = e.clientY + 'px'
          }, 100)
        })

        // Dividir textos em caracteres
        const heroTitle = new window.SplitType('#hero-title', { types: 'chars' })
        const heroSubtitle = new window.SplitType('#hero-subtitle', { types: 'words' })

        // Timeline principal com scroll suave
        const mainTimeline = window.gsap.timeline({
          scrollTrigger: {
            trigger: '#animation-container',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            anticipatePin: 1
          }
        })

        // Animações de fundo dinâmico
        window.gsap.to('.bg-gradient-1', {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: 'none'
        })

        window.gsap.to('.bg-gradient-2', {
          rotation: -360,
          duration: 25,
          repeat: -1,
          ease: 'none'
        })

        // Partículas flutuantes
        window.gsap.to('.particle', {
          y: -100,
          x: 'random(-50, 50)',
          rotation: 'random(-180, 180)',
          duration: 'random(3, 6)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.2
        })

        // SEÇÃO 1: Hero - Entrada dramática
        mainTimeline.from(heroTitle.chars, {
          y: 200,
          opacity: 0,
          scale: 0.3,
          rotation: 45,
          stagger: 0.03,
          ease: 'back.out(2)'
        }, 'hero-start')

        mainTimeline.from(heroSubtitle.words, {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          ease: 'power2.out'
        }, 'hero-start+=0.5')

        mainTimeline.from('#hero-cta', {
          scale: 0,
          opacity: 0,
          ease: 'elastic.out(1, 0.5)'
        }, 'hero-start+=1')

        // SEÇÃO 2: Transição para problema
        mainTimeline.to([heroTitle.chars, heroSubtitle.words, '#hero-cta'], {
          y: -100,
          opacity: 0,
          scale: 0.8,
          stagger: 0.02,
          ease: 'power2.in'
        })

        mainTimeline.fromTo('#problem-section',
          {
            opacity: 0,
            scale: 0.5,
            rotationX: 90
          },
          {
            opacity: 1,
            scale: 1,
            rotationX: 0,
            ease: 'power3.out'
          }
        )

        // SEÇÃO 3: Solução ArcFlow
        mainTimeline.to('#problem-section', {
          opacity: 0,
          scale: 0.8,
          rotationY: -90,
          ease: 'power2.in'
        })

        mainTimeline.fromTo('#solution-section',
          {
            opacity: 0,
            x: '100%',
            rotationY: 90
          },
          {
            opacity: 1,
            x: '0%',
            rotationY: 0,
            ease: 'power3.out'
          }
        )

        // Animação dos ícones da solução
        mainTimeline.from('.solution-icon', {
          scale: 0,
          rotation: 180,
          stagger: 0.1,
          ease: 'back.out(2)'
        }, '>-0.5')

        // SEÇÃO 4: Features com morphing
        mainTimeline.to('#solution-section', {
          opacity: 0,
          scale: 0.9,
          ease: 'power2.in'
        })

        mainTimeline.fromTo('#features-section',
          {
            opacity: 0,
            clipPath: 'circle(0% at 50% 50%)'
          },
          {
            opacity: 1,
            clipPath: 'circle(100% at 50% 50%)',
            ease: 'power2.out'
          }
        )

        // Cards com efeito cascata
        mainTimeline.from('.feature-card', {
          y: 100,
          opacity: 0,
          rotationX: 45,
          stagger: {
            amount: 0.8,
            from: 'random'
          },
          ease: 'power2.out'
        }, '>-0.3')

        // SEÇÃO 5: Números impactantes
        mainTimeline.to('#features-section', {
          opacity: 0,
          scale: 0.8,
          filter: 'blur(10px)',
          ease: 'power2.in'
        })

        mainTimeline.fromTo('#stats-section',
          {
            opacity: 0,
            scale: 2,
            filter: 'blur(20px)'
          },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            ease: 'power2.out'
          }
        )

        // Contadores animados
        mainTimeline.from('.stat-number', {
          textContent: 0,
          duration: 1,
          ease: 'power2.out',
          snap: { textContent: 1 },
          stagger: 0.2
        }, '>-0.5')

        // SEÇÃO 6: Depoimentos com parallax
        mainTimeline.to('#stats-section', {
          opacity: 0,
          y: -100,
          ease: 'power2.in'
        })

        mainTimeline.fromTo('#testimonials-section',
          {
            opacity: 0,
            y: '50%'
          },
          {
            opacity: 1,
            y: '0%',
            ease: 'power3.out'
          }
        )

        // SEÇÃO 7: Pricing com efeito 3D
        mainTimeline.to('#testimonials-section', {
          opacity: 0,
          rotationX: -90,
          transformOrigin: 'center bottom',
          ease: 'power2.in'
        })

        mainTimeline.fromTo('#pricing-section',
          {
            opacity: 0,
            rotationX: 90,
            transformOrigin: 'center top'
          },
          {
            opacity: 1,
            rotationX: 0,
            ease: 'power3.out'
          }
        )

        mainTimeline.from('.pricing-card', {
          y: 200,
          opacity: 0,
          rotationY: 45,
          stagger: 0.2,
          ease: 'back.out(1.5)'
        }, '>-0.5')

        // SEÇÃO 8: CTA Final explosivo
        mainTimeline.to('#pricing-section', {
          opacity: 0,
          scale: 0.5,
          filter: 'blur(10px)',
          ease: 'power2.in'
        })

        mainTimeline.fromTo('#final-cta',
          {
            opacity: 0,
            scale: 0.1,
            rotation: 180
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            ease: 'elastic.out(1, 0.3)'
          }
        )

        // Mudanças de cor de fundo progressivas
        mainTimeline.to('body', {
          backgroundColor: '#0f172a'
        }, 'hero-start')

        mainTimeline.to('body', {
          backgroundColor: '#1e1b4b'
        }, '>25%')

        mainTimeline.to('body', {
          backgroundColor: '#581c87'
        }, '>25%')

        mainTimeline.to('body', {
          backgroundColor: '#7c2d12'
        }, '>25%')

        mainTimeline.to('body', {
          backgroundColor: '#000000'
        }, '>25%')

        // Efeitos de hover interativos
        document.querySelectorAll('.interactive-element').forEach(element => {
          element.addEventListener('mouseenter', () => {
            window.gsap.to(element, {
              scale: 1.05,
              rotationY: 5,
              z: 50,
              duration: 0.3,
              ease: 'power2.out'
            })
          })

          element.addEventListener('mouseleave', () => {
            window.gsap.to(element, {
              scale: 1,
              rotationY: 0,
              z: 0,
              duration: 0.3,
              ease: 'power2.out'
            })
          })
        })
      }
    }

    const timer = setTimeout(initAnimation, 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Scripts GSAP */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://unpkg.com/split-type"
        strategy="beforeInteractive"
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #6366f1;
          --secondary: #8b5cf6;
          --accent: #f59e0b;
          --success: #10b981;
          --danger: #ef4444;
          --dark: #0f172a;
          --light: #f8fafc;
          --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          --gradient-accent: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #000000;
          color: #ffffff;
          overflow-x: hidden;
          cursor: none;
          line-height: 1.6;
        }

        /* Cursor personalizado */
        .custom-cursor {
          position: fixed;
          width: 20px;
          height: 20px;
          background: rgba(99, 102, 241, 0.8);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          transition: transform 0.1s ease;
        }

        .cursor-follower {
          position: fixed;
          width: 40px;
          height: 40px;
          border: 2px solid rgba(99, 102, 241, 0.3);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transition: all 0.3s ease;
        }

        /* Fundo dinâmico */
        .bg-gradient-1, .bg-gradient-2 {
          position: fixed;
          width: 200vw;
          height: 200vh;
          top: -50vh;
          left: -50vw;
          pointer-events: none;
          z-index: -1;
        }

        .bg-gradient-1 {
          background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
        }

        .bg-gradient-2 {
          background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
        }

        /* Partículas */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          pointer-events: none;
        }

        /* Container principal */
        #animation-container {
          position: relative;
          width: 100vw;
          height: 1000vh;
        }

        .sticky-panel {
          position: sticky;
          top: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
        }

        /* SEÇÃO HERO */
        #hero-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(4rem, 12vw, 10rem);
          font-weight: 900;
          text-align: center;
          background: linear-gradient(45deg, #6366f1, #8b5cf6, #f59e0b);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 3s ease-in-out infinite;
          letter-spacing: -0.02em;
          line-height: 0.9;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        #hero-subtitle {
          font-size: clamp(1.2rem, 3vw, 2rem);
          font-weight: 300;
          text-align: center;
          margin-top: 2rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 800px;
        }

        #hero-cta {
          margin-top: 3rem;
          padding: 1.5rem 3rem;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        }

        #hero-cta:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.4);
        }

        .char {
          display: inline-block;
        }

        /* SEÇÃO PROBLEMA */
        #problem-section {
          position: absolute;
          text-align: center;
          max-width: 900px;
          padding: 2rem;
          opacity: 0;
        }

        #problem-section h2 {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: 2rem;
          color: #ef4444;
          font-weight: 700;
        }

        #problem-section p {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1.5rem;
        }

        .problem-list {
          list-style: none;
          text-align: left;
          max-width: 600px;
          margin: 0 auto;
        }

        .problem-list li {
          padding: 1rem 0;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .problem-list li:before {
          content: '❌';
          margin-right: 1rem;
        }

        /* SEÇÃO SOLUÇÃO */
        #solution-section {
          position: absolute;
          text-align: center;
          max-width: 1000px;
          padding: 2rem;
          opacity: 0;
        }

        #solution-section h2 {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: 2rem;
          background: linear-gradient(45deg, #10b981, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .solution-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .solution-item {
          text-align: center;
          padding: 1.5rem;
        }

        .solution-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .solution-item h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .solution-item p {
          color: rgba(255, 255, 255, 0.7);
        }

        /* SEÇÃO FEATURES */
        #features-section {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          padding: 2rem;
        }

        .features-container {
          max-width: 1400px;
          width: 100%;
        }

        .features-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          text-align: center;
          margin-bottom: 3rem;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent);
        }

        .feature-card:hover {
          transform: translateY(-10px) rotateX(5deg);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .feature-card h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          margin-bottom: 1rem;
          color: #ffffff;
          font-weight: 600;
        }

        .feature-card p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          font-size: 1rem;
        }

        /* SEÇÃO ESTATÍSTICAS */
        #stats-section {
          position: absolute;
          text-align: center;
          max-width: 1000px;
          padding: 2rem;
          opacity: 0;
        }

        .stats-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #10b981, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .stats-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 3rem;
        }

        .stat-item {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.08);
        }

        .stat-number {
          font-size: 3.5rem;
          font-weight: 900;
          color: #10b981;
          margin-bottom: 0.5rem;
          font-family: 'Outfit', sans-serif;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
          font-weight: 500;
        }

        /* SEÇÃO DEPOIMENTOS */
        #testimonials-section {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          padding: 2rem;
        }

        .testimonials-container {
          max-width: 1200px;
          width: 100%;
          text-align: center;
        }

        .testimonials-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: 3rem;
          color: #ffffff;
          font-weight: 700;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .testimonial-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: left;
        }

        .testimonial-text {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .author-info h4 {
          color: #ffffff;
          margin-bottom: 0.2rem;
        }

        .author-info p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        /* SEÇÃO PRICING */
        #pricing-section {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          padding: 2rem;
        }

        .pricing-container {
          max-width: 1200px;
          width: 100%;
          text-align: center;
        }

        .pricing-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .pricing-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 3rem;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          align-items: start;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          transition: all 0.4s ease;
          height: 100%;
        }

        .pricing-card.featured {
          border: 2px solid #6366f1;
          transform: scale(1.05);
          background: rgba(99, 102, 241, 0.1);
        }

        .pricing-card.featured::before {
          content: 'MAIS POPULAR';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .pricing-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .plan-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .plan-price {
          font-family: 'Outfit', sans-serif;
          font-size: 3rem;
          font-weight: 900;
          color: #6366f1;
          margin-bottom: 0.5rem;
        }

        .plan-period {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        .plan-features {
          list-style: none;
          margin-bottom: 2.5rem;
          text-align: left;
        }

        .plan-features li {
          padding: 0.8rem 0;
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .plan-features li:before {
          content: '✓';
          color: #10b981;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .plan-button {
          width: 100%;
          padding: 1.2rem 2rem;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .plan-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
        }

        /* SEÇÃO CTA FINAL */
        #final-cta {
          position: absolute;
          text-align: center;
          max-width: 900px;
          padding: 2rem;
          opacity: 0;
        }

        .final-cta-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, #6366f1, #8b5cf6, #f59e0b);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 2s ease-in-out infinite;
        }

        .final-cta-subtitle {
          font-size: 1.4rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .final-cta-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button-primary {
          padding: 1.5rem 3rem;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
          display: inline-block;
        }

        .cta-button-primary:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.4);
        }

        .cta-button-secondary {
          padding: 1.5rem 3rem;
          background: transparent;
          color: white;
          text-decoration: none;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .cta-button-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-3px);
        }

        /* Elementos interativos */
        .interactive-element {
          transition: all 0.3s ease;
          transform-style: preserve-3d;
        }

        /* Responsivo */
        @media (max-width: 768px) {
          .features-grid,
          .pricing-grid,
          .solution-grid,
          .stats-grid,
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
          
          .final-cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-button-primary,
          .cta-button-secondary {
            width: 100%;
            max-width: 300px;
          }

          #hero-title {
            font-size: clamp(3rem, 10vw, 6rem);
          }

          .pricing-card.featured {
            transform: none;
          }

          .pricing-card:hover {
            transform: translateY(-5px);
          }
        }

        @media (max-width: 480px) {
          .sticky-panel {
            padding: 1rem;
          }

          .feature-card,
          .pricing-card,
          .testimonial-card {
            padding: 1.5rem;
          }
        }

        /* Animações adicionais */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .floating {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .pulsing {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div id="animation-container">
        <div className="sticky-panel">
          {/* Título Hero */}
          <h1 id="hero-title">ARCFLOW</h1>

          {/* Seção About */}
          <div id="about-section">
            <h2>Uma Nova Dimensão.</h2>
            <p>
              A plataforma SaaS definitiva para escritórios AEC. Combinamos design imersivo
              e automação inteligente em um fluxo contínuo que redefine a produtividade.
            </p>
          </div>

          {/* Seção Features */}
          <div id="features-section">
            <div className="features-grid">
              <div className="feature-card">
                <h3>📋 Briefing Inteligente</h3>
                <p>230+ perguntas especializadas que capturam cada detalhe do seu projeto com precisão cirúrgica.</p>
              </div>
              <div className="feature-card">
                <h3>🏗️ Gestão AEC</h3>
                <p>Metodologia baseada em NBR 13532 com workflows específicos para arquitetura e engenharia.</p>
              </div>
              <div className="feature-card">
                <h3>💰 Análise Financeira</h3>
                <p>Dashboard "Onde vai seu dinheiro" com controle de margem e rentabilidade por projeto.</p>
              </div>
              <div className="feature-card">
                <h3>🤖 IA Preditiva</h3>
                <p>Automação que antecipa necessidades e otimiza processos automaticamente.</p>
              </div>
              <div className="feature-card">
                <h3>📱 Multi-plataforma</h3>
                <p>Acesse de qualquer lugar, qualquer dispositivo, com sincronização em tempo real.</p>
              </div>
              <div className="feature-card">
                <h3>🔗 Integração Total</h3>
                <p>Conecte todas suas ferramentas favoritas em um ecossistema unificado.</p>
              </div>
            </div>
          </div>

          {/* Seção Results */}
          <div id="results-section">
            <h2>Resultados Comprovados</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#d1d5db' }}>
              Dados reais de 500+ escritórios que transformaram seus resultados
            </p>
            <div className="results-grid">
              <div className="result-item">
                <div className="result-number">500+</div>
                <div className="result-label">Escritórios Ativos</div>
              </div>
              <div className="result-item">
                <div className="result-number">40%</div>
                <div className="result-label">Mais Produtividade</div>
              </div>
              <div className="result-item">
                <div className="result-number">35%</div>
                <div className="result-label">Aumento de Margem</div>
              </div>
              <div className="result-item">
                <div className="result-number">95%</div>
                <div className="result-label">Satisfação</div>
              </div>
            </div>
          </div>

          {/* Seção Pricing */}
          <div id="pricing-section">
            <div className="pricing-container">
              <h2 className="pricing-title">Escolha Seu Plano</h2>
              <div className="pricing-grid">
                <div className="pricing-card">
                  <div className="plan-name">Starter</div>
                  <div className="plan-price">R$ 97</div>
                  <div className="plan-period">/mês</div>
                  <ul className="plan-features">
                    <li>Até 3 usuários</li>
                    <li>Briefing estruturado</li>
                    <li>5 projetos simultâneos</li>
                    <li>Suporte por email</li>
                  </ul>
                  <button className="plan-button">Começar Agora</button>
                </div>

                <div className="pricing-card featured">
                  <div className="plan-name">Professional</div>
                  <div className="plan-price">R$ 197</div>
                  <div className="plan-period">/mês</div>
                  <ul className="plan-features">
                    <li>Usuários ilimitados</li>
                    <li>Todos os módulos</li>
                    <li>Projetos ilimitados</li>
                    <li>Análise de produtividade</li>
                    <li>Suporte prioritário</li>
                  </ul>
                  <button className="plan-button">Mais Popular</button>
                </div>

                <div className="pricing-card">
                  <div className="plan-name">Enterprise</div>
                  <div className="plan-price">R$ 397</div>
                  <div className="plan-period">/mês</div>
                  <ul className="plan-features">
                    <li>Tudo do Professional</li>
                    <li>API personalizada</li>
                    <li>Integrações customizadas</li>
                    <li>Suporte dedicado</li>
                    <li>SLA garantido</li>
                  </ul>
                  <button className="plan-button">Falar com Vendas</button>
                </div>
              </div>
            </div>
          </div>

          {/* Seção CTA Final */}
          <div id="cta-section">
            <h2>Entre no Fluxo.</h2>
            <a href="/onboarding/perfil" className="cta-button">
              Começar Agora
            </a>
          </div>
        </div>
      </div>
    </>
  )
}