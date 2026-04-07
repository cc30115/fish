import { SpeciesData, DEPTH_ZONES } from './species';

export class Fish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetVx: number;
  targetVy: number;
  wanderTheta: number;
  state: 'idle' | 'hover' | 'dragging';
  species: SpeciesData;
  timeOffset: number;
  customSvgImage: HTMLImageElement | null = null;   // preloaded SVG icon
  speciesImage: HTMLImageElement | null = null;      // preloaded photo for masking
  
  constructor(width: number, worldHeight: number, species: SpeciesData) {
    this.species = species;
    this.x = Math.random() * width;
    this.y = (species.depth[0] + Math.random() * (species.depth[1] - species.depth[0])) * worldHeight;
    this.vx = (Math.random() - 0.5) * species.baseSpeed;
    this.vy = (Math.random() - 0.5) * species.baseSpeed;
    this.targetVx = this.vx;
    this.targetVy = this.vy;
    this.wanderTheta = Math.random() * Math.PI * 2;
    this.state = 'idle';
    this.timeOffset = Math.random() * 1000;

    // Preload custom SVG icon if species has one
    const svgTrait = species.traits?.find(t => t.name === '__customSvg');
    if (svgTrait?.value) {
      const svgImg = new Image();
      const blob = new Blob([svgTrait.value], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      svgImg.onload = () => URL.revokeObjectURL(url);
      svgImg.src = url;
      this.customSvgImage = svgImg;
    }

    // Preload species photo for image masking
    if (species.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = species.imageUrl;
      this.speciesImage = img;
    }
  }

  update(dt: number, width: number, worldHeight: number, interaction: InteractionController) {
    const timeScale = dt / 16.66;
    const time = performance.now() * 0.001 + this.timeOffset;

    if (this.state === 'dragging') {
      const dx = interaction.worldMouseX - this.x;
      const dy = interaction.worldMouseY - this.y;
      this.x += dx * 0.1 * timeScale;
      this.y += dy * 0.1 * timeScale;
      
      this.vx = dx * 0.1;
      this.vy = dy * 0.1;
    } else {
      if (this.species.type === 'jelly') {
        this.targetVx = Math.cos(this.wanderTheta) * this.species.baseSpeed * 0.2;
        this.targetVy = -Math.abs(Math.sin(time * 2)) * this.species.baseSpeed;
        this.wanderTheta += (Math.random() - 0.5) * 0.05 * timeScale;
      } else if (this.species.type === 'squid') {
        // Jet propulsion movement
        if (Math.random() < 0.01) {
          this.wanderTheta += (Math.random() - 0.5) * Math.PI;
          this.targetVx = Math.cos(this.wanderTheta) * this.species.baseSpeed * 4;
          this.targetVy = Math.sin(this.wanderTheta) * this.species.baseSpeed * 4;
        } else {
          this.targetVx *= 0.98;
          this.targetVy *= 0.98;
        }
      } else {
        this.wanderTheta += (Math.random() - 0.5) * 0.2 * timeScale;
        const speed = this.state === 'hover' ? this.species.baseSpeed * 0.5 : this.species.baseSpeed;
        this.targetVx = Math.cos(this.wanderTheta) * speed;
        this.targetVy = Math.sin(this.wanderTheta) * speed;
      }
      
      const minY = this.species.depth[0] * worldHeight;
      const maxY = this.species.depth[1] * worldHeight;
      const margin = 50;
      
      if (this.y < minY + margin) {
        this.targetVy += 0.2 * timeScale;
      } else if (this.y > maxY - margin) {
        this.targetVy -= 0.2 * timeScale;
      }
      
      if (this.x < -this.species.size * 3) this.x = width + this.species.size * 3;
      if (this.x > width + this.species.size * 3) this.x = -this.species.size * 3;
      
      this.vx += (this.targetVx - this.vx) * 0.02 * timeScale;
      this.vy += (this.targetVy - this.vy) * 0.02 * timeScale;
      
      this.x += this.vx * timeScale;
      this.y += this.vy * timeScale;
    }
  }

  draw(ctx: CanvasRenderingContext2D, colorOverride?: string) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    const angle = Math.atan2(this.vy, this.vx);
    if (this.species.type !== 'jelly') {
      ctx.rotate(angle);
    }
    
    if (this.state === 'hover' || this.state === 'dragging') {
      ctx.shadowBlur = 20;
      ctx.shadowColor = colorOverride ?? this.species.color;
      ctx.scale(1.2, 1.2);
    }
    
    ctx.fillStyle = colorOverride ?? this.species.color;
    ctx.strokeStyle = colorOverride ?? this.species.color;
    const size = this.species.size;
    const time = performance.now() * 0.001 + this.timeOffset;
    
    if (this.species.type === 'tetra') {
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-size * 0.8, 0);
      ctx.lineTo(-size * 1.5, -size * 0.6);
      ctx.lineTo(-size * 1.5, size * 0.6);
      ctx.fill();
    } else if (this.species.type === 'ray') {
      ctx.beginPath();
      ctx.moveTo(size, 0);
      ctx.lineTo(-size * 0.5, -size * 0.8);
      ctx.lineTo(-size, 0);
      ctx.lineTo(-size * 0.5, size * 0.8);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.lineTo(-size * 2.5, 0);
      ctx.strokeStyle = this.species.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (this.species.type === 'angler') {
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-size * 0.8, 0);
      ctx.lineTo(-size * 1.8, -size * 0.6);
      ctx.lineTo(-size * 1.8, size * 0.6);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.8);
      ctx.quadraticCurveTo(size * 1.5, -size * 1.5, size * 1.5, 0);
      ctx.strokeStyle = this.species.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(size * 1.5, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fff';
      ctx.fill();
    } else if (this.species.type === 'jelly') {
      const pulse = Math.sin(time * 2) * 0.1 + 0.9;
      ctx.scale(pulse, pulse);
      ctx.beginPath();
      ctx.arc(0, 0, size, Math.PI, 0);
      ctx.quadraticCurveTo(0, size * 0.5, -size, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-size * 0.5, 0);
      ctx.lineTo(-size * 0.5 + Math.sin(time * 3) * size * 0.2, size * 1.5);
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.sin(time * 3 + 1) * size * 0.2, size * 1.8);
      ctx.moveTo(size * 0.5, 0);
      ctx.lineTo(size * 0.5 + Math.sin(time * 3 + 2) * size * 0.2, size * 1.5);
      ctx.strokeStyle = this.species.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (this.species.type === 'swarm') {
      for (let i = 0; i < 5; i++) {
        const ox = Math.cos(i * Math.PI * 0.4 + time * 2) * size;
        const oy = Math.sin(i * Math.PI * 0.4 + time * 2) * size;
        ctx.beginPath();
        ctx.ellipse(ox, oy, size * 0.4, size * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.species.type === 'flat') {
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-size * 0.8, 0);
      ctx.lineTo(-size * 1.2, -size * 0.8);
      ctx.lineTo(-size * 1.2, size * 0.8);
      ctx.fill();
    } else if (this.species.type === 'squid') {
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tentacles
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-size * 0.8, i * size * 0.2);
        ctx.quadraticCurveTo(
          -size * 1.5, 
          i * size * 0.5 + Math.sin(time * 5 + i) * size * 0.5, 
          -size * 2, 
          i * size * 0.3
        );
        ctx.strokeStyle = this.species.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    } else if (this.species.type === 'custom') {
      // Draw custom SVG shape
      if (this.customSvgImage && this.customSvgImage.complete) {
        ctx.drawImage(this.customSvgImage, -size, -size, size * 2, size * 2);
      } else {
        // Fallback: draw a simple fish tetra shape while loading
        ctx.beginPath();
        ctx.ellipse(0, 0, size, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-size * 0.8, 0);
        ctx.lineTo(-size * 1.5, -size * 0.6);
        ctx.lineTo(-size * 1.5, size * 0.6);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

export class Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  depthFactor: number;
  
  constructor(width: number, worldHeight: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * worldHeight;
    this.size = Math.random() * 2 + 0.5;
    this.speed = Math.random() * 0.5 + 0.1;
    this.opacity = Math.random() * 0.3 + 0.05;
    this.depthFactor = Math.random() * 0.5 + 0.5;
  }
  
  update(worldHeight: number, dt: number) {
    const timeScale = dt / 16.66;
    this.y -= this.speed * timeScale;
    if (this.y < -10) {
      this.y = worldHeight + 10;
    }
  }
  
  draw(ctx: CanvasRenderingContext2D, cameraY: number) {
    const parallaxY = this.y - cameraY * (1 - this.depthFactor);
    
    if (parallaxY > -10 && parallaxY < ctx.canvas.height + 10) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, parallaxY, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export class Leviathan {
  active: boolean = false;
  x: number = 0;
  y: number = 0;
  scale: number = 0.1;
  opacity: number = 0;
  timer: number = 0;
  
  trigger(x: number, y: number) {
    if (this.active) return;
    this.active = true;
    this.x = x;
    this.y = y;
    this.scale = 0.05;
    this.opacity = 0;
    this.timer = 0;
  }
  
  update(dt: number) {
    if (!this.active) return;
    this.timer += dt;
    
    const timeScale = dt / 16.66;
    this.scale *= Math.pow(1.015, timeScale); // Exponential growth simulating coming closer
    
    if (this.timer < 3000) {
      this.opacity = Math.min(0.6, this.timer / 2000);
    } else {
      this.opacity = Math.max(0, 0.6 - (this.timer - 3000) / 1000);
    }
    
    if (this.timer > 4500) {
      this.active = false;
    }
  }
  
  draw(ctx: CanvasRenderingContext2D, cameraY: number) {
    if (!this.active) return;
    
    ctx.save();
    ctx.translate(this.x, this.y - cameraY);
    ctx.scale(this.scale, this.scale);
    
    // Giant front-facing creature (shadowy)
    ctx.fillStyle = `rgba(5, 10, 20, ${this.opacity})`;
    ctx.shadowBlur = 100;
    ctx.shadowColor = `rgba(0, 0, 0, ${this.opacity})`;
    
    // Massive body
    ctx.beginPath();
    ctx.ellipse(0, 0, 150, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Fins
    ctx.beginPath();
    ctx.moveTo(-100, 0);
    ctx.lineTo(-300, 50);
    ctx.lineTo(-120, 40);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(300, 50);
    ctx.lineTo(120, 40);
    ctx.fill();
    
    // Glowing eyes
    ctx.fillStyle = `rgba(0, 255, 200, ${this.opacity * 0.8})`;
    ctx.shadowBlur = 50;
    ctx.shadowColor = `rgba(0, 255, 200, ${this.opacity})`;
    
    ctx.beginPath();
    ctx.ellipse(-50, -20, 15, 5, Math.PI * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(50, -20, 15, 5, -Math.PI * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // Giant open maw
    ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity * 0.9})`;
    ctx.beginPath();
    ctx.ellipse(0, 40, 80, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

export class InteractionController {
  canvas: HTMLCanvasElement;
  engine: AquariumEngine;
  mouseX: number = 0;
  mouseY: number = 0;
  worldMouseX: number = 0;
  worldMouseY: number = 0;
  isMouseDown: boolean = false;
  hoveredFish: Fish | null = null;
  draggedFish: Fish | null = null;
  longPressTimer: number = 0;
  longPressDuration: number = 1000;
  isLongPressComplete: boolean = false;
  
  constructor(canvas: HTMLCanvasElement, engine: AquariumEngine) {
    this.canvas = canvas;
    this.engine = engine;
    
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    
    canvas.addEventListener('mousemove', this.handleMouseMove);
    canvas.addEventListener('mousedown', this.handleMouseDown);
    canvas.addEventListener('mouseup', this.handleMouseUp);
    canvas.addEventListener('mouseleave', this.handleMouseUp);
  }

  dispose() {
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
  }
  
  handleMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    this.worldMouseX = this.mouseX;
    this.worldMouseY = this.mouseY + this.engine.cameraY;
    
    if (!this.isMouseDown) {
      let found: Fish | null = null;
      for (let i = this.engine.fish.length - 1; i >= 0; i--) {
        const f = this.engine.fish[i];
        const dist = Math.hypot(f.x - this.worldMouseX, f.y - this.worldMouseY);
        if (dist < f.species.size * 2.5) {
          found = f;
          break;
        }
      }
      
      if (this.hoveredFish && this.hoveredFish !== found) {
        this.hoveredFish.state = 'idle';
      }
      this.hoveredFish = found;
      if (this.hoveredFish) {
        this.hoveredFish.state = 'hover';
      }
    }
  }
  
  handleMouseDown(e: MouseEvent) {
    this.isMouseDown = true;
    if (this.hoveredFish) {
      this.draggedFish = this.hoveredFish;
      this.draggedFish.state = 'dragging';
      this.longPressTimer = 0;
      this.isLongPressComplete = false;
    } else {
      this.engine.callbacks.onSelect(null);
    }
  }
  
  handleMouseUp(e: MouseEvent) {
    this.isMouseDown = false;
    if (this.draggedFish) {
      this.draggedFish.state = 'idle';
      this.draggedFish = null;
    }
    this.longPressTimer = 0;
  }
  
  update(dt: number) {
    if (this.isMouseDown && this.draggedFish && !this.isLongPressComplete) {
      this.longPressTimer += dt;
      if (this.longPressTimer >= this.longPressDuration) {
        this.isLongPressComplete = true;
        this.engine.callbacks.onSelect(this.draggedFish);
      }
    }
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    if (this.isMouseDown && this.draggedFish && !this.isLongPressComplete) {
      const progress = this.longPressTimer / this.longPressDuration;
      ctx.save();
      ctx.translate(this.draggedFish.x, this.draggedFish.y);
      
      ctx.beginPath();
      ctx.arc(0, 0, this.draggedFish.species.size * 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(0, 0, this.draggedFish.species.size * 3, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
      ctx.strokeStyle = '#00D4FF';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      ctx.restore();
    }
  }
}

export interface EngineCallbacks {
  onSelect: (fish: Fish | null) => void;
  onDepthChange: (depth: number) => void;
}

export class AquariumEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  callbacks: EngineCallbacks;
  interaction: InteractionController;
  fish: Fish[] = [];
  particles: Particle[] = [];
  leviathan: Leviathan;
  lastTime: number = 0;
  animationFrameId: number = 0;
  
  worldHeight: number = 8000;
  cameraY: number = 0;
  targetCameraY: number = 0;
  speciesData: SpeciesData[] = [];
  colorOverride: string | null = null;

  setColorTheme(color: string | null) {
    this.colorOverride = color;
  }
  
  constructor(canvas: HTMLCanvasElement, callbacks: EngineCallbacks, speciesData: SpeciesData[]) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;
    this.speciesData = speciesData;
    this.interaction = new InteractionController(canvas, this);
    this.leviathan = new Leviathan();
    
    this.handleResize = this.handleResize.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    
    window.addEventListener('resize', this.handleResize);
    canvas.addEventListener('wheel', this.handleWheel, { passive: false });
    
    this.handleResize();
    this.initEcosystem();
  }
  
  dispose() {
    window.removeEventListener('resize', this.handleResize);
    this.canvas.removeEventListener('wheel', this.handleWheel);
    this.interaction.dispose();
    cancelAnimationFrame(this.animationFrameId);
  }
  
  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.worldHeight = Math.max(8000, this.canvas.height * 8);
    this.clampCamera();
  }
  
  handleWheel(e: WheelEvent) {
    e.preventDefault();
    this.targetCameraY += e.deltaY;
    this.clampCamera();
  }
  
  scrollToDepth(normalizedDepth: number) {
    const maxScroll = this.worldHeight - this.canvas.height;
    this.targetCameraY = normalizedDepth * maxScroll;
    this.clampCamera();
  }
  
  triggerLeviathan() {
    if (!this.leviathan.active) {
      this.leviathan.trigger(
        this.canvas.width / 2,
        this.cameraY + this.canvas.height / 2
      );
    }
  }
  
  clampCamera() {
    const maxScroll = this.worldHeight - this.canvas.height;
    if (this.targetCameraY < 0) this.targetCameraY = 0;
    if (this.targetCameraY > maxScroll) this.targetCameraY = maxScroll;
  }
  
  initEcosystem() {
    this.fish = [];
    const area = this.canvas.width * this.worldHeight;
    const count = Math.min(Math.floor(area / 30000), 250);
    
    if (this.speciesData.length === 0) return;

    for (let i = 0; i < count; i++) {
      const species = this.speciesData[Math.floor(Math.random() * this.speciesData.length)];
      this.fish.push(new Fish(this.canvas.width, this.worldHeight, species));
    }
    
    this.particles = [];
    for (let i = 0; i < 500; i++) {
      this.particles.push(new Particle(this.canvas.width, this.worldHeight));
    }
  }
  
  start() {
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.animationFrameId = requestAnimationFrame(this.loop);
  }
  
  stop() {
    cancelAnimationFrame(this.animationFrameId);
  }
  
  loop(time: number) {
    const dt = time - this.lastTime;
    this.lastTime = time;
    
    this.update(dt);
    this.draw();
    
    this.animationFrameId = requestAnimationFrame(this.loop);
  }
  
  update(dt: number) {
    const timeScale = dt / 16.66;
    
    const prevCameraY = this.cameraY;
    this.cameraY += (this.targetCameraY - this.cameraY) * 0.08 * timeScale;
    
    if (Math.abs(this.cameraY - prevCameraY) > 0.5) {
      const maxScroll = this.worldHeight - this.canvas.height;
      this.callbacks.onDepthChange(maxScroll > 0 ? this.cameraY / maxScroll : 0);
    }
    
    this.interaction.worldMouseX = this.interaction.mouseX;
    this.interaction.worldMouseY = this.interaction.mouseY + this.cameraY;
    
    this.interaction.update(dt);
    
    for (const p of this.particles) {
      p.update(this.worldHeight, dt);
    }
    
    let visibleFishCount = 0;
    const visibleTop = this.cameraY - 200;
    const visibleBottom = this.cameraY + this.canvas.height + 200;
    
    for (const f of this.fish) {
      f.update(dt, this.canvas.width, this.worldHeight, this.interaction);
      
      if (f.y > visibleTop && f.y < visibleBottom) {
        visibleFishCount++;
      }
    }
    
    if (visibleFishCount < 12) {
      for (const f of this.fish) {
        if (f.y < visibleTop - 500 || f.y > visibleBottom + 500) {
          const speciesMinY = f.species.depth[0] * this.worldHeight;
          const speciesMaxY = f.species.depth[1] * this.worldHeight;
          
          const overlapTop = Math.max(visibleTop, speciesMinY);
          const overlapBottom = Math.min(visibleBottom, speciesMaxY);
          
          if (overlapTop < overlapBottom) {
            f.y = overlapTop + Math.random() * (overlapBottom - overlapTop);
            f.x = Math.random() > 0.5 ? -50 : this.canvas.width + 50;
            break;
          }
        }
      }
    }
    
    // Update Leviathan
    const maxScroll = this.worldHeight - this.canvas.height;
    const normalizedDepth = maxScroll > 0 ? this.cameraY / maxScroll : 0;
    if (normalizedDepth > 0.75 && !this.leviathan.active) {
      if (Math.random() < 0.002) { // Rare chance to spawn in deep zones
        this.leviathan.trigger(
          this.canvas.width / 2 + (Math.random() - 0.5) * 400, 
          this.cameraY + this.canvas.height / 2 + (Math.random() - 0.5) * 200
        );
      }
    }
    this.leviathan.update(dt);
  }
  
  draw() {
    // Dynamic background gradient based on camera position
    const maxScroll = this.worldHeight - this.canvas.height;
    const normalizedDepth = maxScroll > 0 ? this.cameraY / maxScroll : 0;
    
    // Find current and next zone for color interpolation
    let currentZone = DEPTH_ZONES[0];
    let nextZone = DEPTH_ZONES[0];
    let blend = 0;
    
    for (let i = 0; i < DEPTH_ZONES.length - 1; i++) {
      if (normalizedDepth >= DEPTH_ZONES[i].range[0] && normalizedDepth <= DEPTH_ZONES[i+1].range[0]) {
        currentZone = DEPTH_ZONES[i];
        nextZone = DEPTH_ZONES[i+1];
        blend = (normalizedDepth - currentZone.range[0]) / (nextZone.range[0] - currentZone.range[0]);
        break;
      }
    }
    if (normalizedDepth >= DEPTH_ZONES[DEPTH_ZONES.length-1].range[0]) {
      currentZone = DEPTH_ZONES[DEPTH_ZONES.length-1];
      nextZone = currentZone;
      blend = 0;
    }

    // Simple hex to rgb interpolation for the top color
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    
    const c1 = hexToRgb(currentZone.color);
    const c2 = hexToRgb(nextZone.color);
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * blend);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * blend);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * blend);
    const topColor = `rgb(${r}, ${g}, ${b})`;
    
    // Bottom color is the next zone's color (or black if at bottom)
    const bottomColor = nextZone.color;

    const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, bottomColor);
    
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Particle density decreases with depth
    const particleVisibilityThreshold = 1 - (normalizedDepth * 0.8);
    
    for (const p of this.particles) {
      if (p.opacity < particleVisibilityThreshold) {
        p.draw(this.ctx, this.cameraY);
      }
    }
    
    // Draw Leviathan (behind fish)
    this.leviathan.draw(this.ctx, this.cameraY);
    
    this.ctx.save();
    this.ctx.translate(0, -this.cameraY);
    
    for (const f of this.fish) {
      if (f.y > this.cameraY - 100 && f.y < this.cameraY + this.canvas.height + 100) {
        f.draw(this.ctx, this.colorOverride ?? undefined);
      }
    }
    
    this.interaction.draw(this.ctx);
    
    this.ctx.restore();
  }
}
