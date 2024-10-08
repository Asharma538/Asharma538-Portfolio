!(function (t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (exports._vantaEffect = e())
    : (t._vantaEffect = e());
})("undefined" != typeof self ? self : this, () =>
  (() => {
    "use strict";
    var t = {
        d: (e, i) => {
          for (var s in i)
            t.o(i, s) &&
              !t.o(e, s) &&
              Object.defineProperty(e, s, { enumerable: !0, get: i[s] });
        },
        o: (t, e) => Object.prototype.hasOwnProperty.call(t, e),
        r: (t) => {
          "undefined" != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
            Object.defineProperty(t, "__esModule", { value: !0 });
        },
      },
      e = {};
    function i() {
      return "undefined" != typeof navigator
        ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ) || window.innerWidth < 600
        : null;
    }
    t.r(e),
      t.d(e, { default: () => m }),
      (Number.prototype.clamp = function (t, e) {
        return Math.min(Math.max(this, t), e);
      });
    const s = (t) => t[Math.floor(Math.random() * t.length)];
    function o(t, e) {
      return (
        null == t && (t = 0), null == e && (e = 1), t + Math.random() * (e - t)
      );
    }
    function n(t, e) {
      return (
        null == t && (t = 0),
        null == e && (e = 1),
        Math.floor(t + Math.random() * (e - t + 1))
      );
    }
    function r(t) {
      for (; t.children && t.children.length > 0; )
        r(t.children[0]), t.remove(t.children[0]);
      t.geometry && t.geometry.dispose(),
        t.material &&
          (Object.keys(t.material).forEach((e) => {
            t.material[e] &&
              null !== t.material[e] &&
              "function" == typeof t.material[e].dispose &&
              t.material[e].dispose();
          }),
          t.material.dispose());
    }
    const h = "object" == typeof window;
    let a = (h && window.THREE) || {};
    h && !window.VANTA && (window.VANTA = {});
    const l = (h && window.VANTA) || {};
    (l.register = (t, e) => (l[t] = (t) => new e(t))), (l.version = "0.5.24");
    const c = function () {
      return (
        Array.prototype.unshift.call(arguments, "[VANTA]"),
        console.error.apply(this, arguments)
      );
    };
    l.VantaBase = class {
      constructor(t = {}) {
        if (!h) return !1;
        (l.current = this),
          (this.windowMouseMoveWrapper =
            this.windowMouseMoveWrapper.bind(this)),
          (this.windowTouchWrapper = this.windowTouchWrapper.bind(this)),
          (this.windowGyroWrapper = this.windowGyroWrapper.bind(this)),
          (this.resize = this.resize.bind(this)),
          (this.animationLoop = this.animationLoop.bind(this)),
          (this.restart = this.restart.bind(this));
        const e =
          "function" == typeof this.getDefaultOptions
            ? this.getDefaultOptions()
            : this.defaultOptions;
        if (
          ((this.options = Object.assign(
            {
              mouseControls: !0,
              touchControls: !0,
              gyroControls: !1,
              minHeight: 200,
              minWidth: 200,
              scale: 1,
              scaleMobile: 1,
            },
            e
          )),
          (t instanceof HTMLElement || "string" == typeof t) && (t = { el: t }),
          Object.assign(this.options, t),
          this.options.THREE && (a = this.options.THREE),
          (this.el = this.options.el),
          null == this.el)
        )
          c('Instance needs "el" param!');
        else if (!(this.options.el instanceof HTMLElement)) {
          const t = this.el;
          if (((this.el = ((i = t), document.querySelector(i))), !this.el))
            return void c("Cannot find element", t);
        }
        var i, s;
        this.prepareEl(), this.initThree(), this.setSize();
        try {
          this.init();
        } catch (t) {
          return (
            c("Init error", t),
            this.renderer &&
              this.renderer.domElement &&
              this.el.removeChild(this.renderer.domElement),
            void (
              this.options.backgroundColor &&
              (console.log("[VANTA] Falling back to backgroundColor"),
              (this.el.style.background =
                ((s = this.options.backgroundColor),
                "number" == typeof s
                  ? "#" + ("00000" + s.toString(16)).slice(-6)
                  : s)))
            )
          );
        }
        this.initMouse(), this.resize(), this.animationLoop();
        const o = window.addEventListener;
        o("resize", this.resize),
          window.requestAnimationFrame(this.resize),
          this.options.mouseControls &&
            (o("scroll", this.windowMouseMoveWrapper),
            o("mousemove", this.windowMouseMoveWrapper)),
          this.options.touchControls &&
            (o("touchstart", this.windowTouchWrapper),
            o("touchmove", this.windowTouchWrapper)),
          this.options.gyroControls &&
            o("deviceorientation", this.windowGyroWrapper);
      }
      setOptions(t = {}) {
        Object.assign(this.options, t), this.triggerMouseMove();
      }
      prepareEl() {
        let t, e;
        if ("undefined" != typeof Node && Node.TEXT_NODE)
          for (t = 0; t < this.el.childNodes.length; t++) {
            const e = this.el.childNodes[t];
            if (e.nodeType === Node.TEXT_NODE) {
              const t = document.createElement("span");
              (t.textContent = e.textContent),
                e.parentElement.insertBefore(t, e),
                e.remove();
            }
          }
        for (t = 0; t < this.el.children.length; t++)
          (e = this.el.children[t]),
            "static" === getComputedStyle(e).position &&
              (e.style.position = "relative"),
            "auto" === getComputedStyle(e).zIndex && (e.style.zIndex = 1);
        "static" === getComputedStyle(this.el).position &&
          (this.el.style.position = "relative");
      }
      applyCanvasStyles(t, e = {}) {
        Object.assign(t.style, {
          position: "absolute",
          zIndex: 0,
          top: 0,
          left: 0,
          background: "",
        }),
          Object.assign(t.style, e),
          t.classList.add("vanta-canvas");
      }
      initThree() {
        a.WebGLRenderer
          ? ((this.renderer = new a.WebGLRenderer({
              alpha: !0,
              antialias: !0,
            })),
            this.el.appendChild(this.renderer.domElement),
            this.applyCanvasStyles(this.renderer.domElement),
            isNaN(this.options.backgroundAlpha) &&
              (this.options.backgroundAlpha = 1),
            (this.scene = new a.Scene()))
          : console.warn("[VANTA] No THREE defined on window");
      }
      getCanvasElement() {
        return this.renderer
          ? this.renderer.domElement
          : this.p5renderer
          ? this.p5renderer.canvas
          : void 0;
      }
      getCanvasRect() {
        const t = this.getCanvasElement();
        return !!t && t.getBoundingClientRect();
      }
      windowMouseMoveWrapper(t) {
        const e = this.getCanvasRect();
        if (!e) return !1;
        const i = t.clientX - e.left,
          s = t.clientY - e.top;
        i >= 0 &&
          s >= 0 &&
          i <= e.width &&
          s <= e.height &&
          ((this.mouseX = i),
          (this.mouseY = s),
          this.options.mouseEase || this.triggerMouseMove(i, s));
      }
      windowTouchWrapper(t) {
        const e = this.getCanvasRect();
        if (!e) return !1;
        if (1 === t.touches.length) {
          const i = t.touches[0].clientX - e.left,
            s = t.touches[0].clientY - e.top;
          i >= 0 &&
            s >= 0 &&
            i <= e.width &&
            s <= e.height &&
            ((this.mouseX = i),
            (this.mouseY = s),
            this.options.mouseEase || this.triggerMouseMove(i, s));
        }
      }
      windowGyroWrapper(t) {
        const e = this.getCanvasRect();
        if (!e) return !1;
        const i = Math.round(2 * t.alpha) - e.left,
          s = Math.round(2 * t.beta) - e.top;
        i >= 0 &&
          s >= 0 &&
          i <= e.width &&
          s <= e.height &&
          ((this.mouseX = i),
          (this.mouseY = s),
          this.options.mouseEase || this.triggerMouseMove(i, s));
      }
      triggerMouseMove(t, e) {
        void 0 === t &&
          void 0 === e &&
          (this.options.mouseEase
            ? ((t = this.mouseEaseX), (e = this.mouseEaseY))
            : ((t = this.mouseX), (e = this.mouseY))),
          this.uniforms &&
            ((this.uniforms.iMouse.value.x = t / this.scale),
            (this.uniforms.iMouse.value.y = e / this.scale));
        const i = t / this.width,
          s = e / this.height;
        "function" == typeof this.onMouseMove && this.onMouseMove(i, s);
      }
      setSize() {
        this.scale || (this.scale = 1),
          i() && this.options.scaleMobile
            ? (this.scale = this.options.scaleMobile)
            : this.options.scale && (this.scale = this.options.scale),
          (this.width = Math.max(this.el.offsetWidth, this.options.minWidth)),
          (this.height = Math.max(
            this.el.offsetHeight,
            this.options.minHeight
          ));
      }
      initMouse() {
        ((!this.mouseX && !this.mouseY) ||
          (this.mouseX === this.options.minWidth / 2 &&
            this.mouseY === this.options.minHeight / 2)) &&
          ((this.mouseX = this.width / 2),
          (this.mouseY = this.height / 2),
          this.triggerMouseMove(this.mouseX, this.mouseY));
      }
      resize() {
        this.setSize(),
          this.camera &&
            ((this.camera.aspect = this.width / this.height),
            "function" == typeof this.camera.updateProjectionMatrix &&
              this.camera.updateProjectionMatrix()),
          this.renderer &&
            (this.renderer.setSize(this.width, this.height),
            this.renderer.setPixelRatio(window.devicePixelRatio / this.scale)),
          "function" == typeof this.onResize && this.onResize();
      }
      isOnScreen() {
        const t = this.el.offsetHeight,
          e = this.el.getBoundingClientRect(),
          i =
            window.pageYOffset ||
            (
              document.documentElement ||
              document.body.parentNode ||
              document.body
            ).scrollTop,
          s = e.top + i;
        return s - window.innerHeight <= i && i <= s + t;
      }
      animationLoop() {
        this.t || (this.t = 0), this.t2 || (this.t2 = 0);
        const t = performance.now();
        if (this.prevNow) {
          let e = (t - this.prevNow) / (1e3 / 60);
          (e = Math.max(0.2, Math.min(e, 5))),
            (this.t += e),
            (this.t2 += (this.options.speed || 1) * e),
            this.uniforms && (this.uniforms.iTime.value = 0.016667 * this.t2);
        }
        return (
          (this.prevNow = t),
          this.options.mouseEase &&
            ((this.mouseEaseX = this.mouseEaseX || this.mouseX || 0),
            (this.mouseEaseY = this.mouseEaseY || this.mouseY || 0),
            Math.abs(this.mouseEaseX - this.mouseX) +
              Math.abs(this.mouseEaseY - this.mouseY) >
              0.1 &&
              ((this.mouseEaseX += 0.05 * (this.mouseX - this.mouseEaseX)),
              (this.mouseEaseY += 0.05 * (this.mouseY - this.mouseEaseY)),
              this.triggerMouseMove(this.mouseEaseX, this.mouseEaseY))),
          (this.isOnScreen() || this.options.forceAnimate) &&
            ("function" == typeof this.onUpdate && this.onUpdate(),
            this.scene &&
              this.camera &&
              (this.renderer.render(this.scene, this.camera),
              this.renderer.setClearColor(
                this.options.backgroundColor,
                this.options.backgroundAlpha
              )),
            this.fps && this.fps.update && this.fps.update(),
            "function" == typeof this.afterRender && this.afterRender()),
          (this.req = window.requestAnimationFrame(this.animationLoop))
        );
      }
      restart() {
        if (this.scene)
          for (; this.scene.children.length; )
            this.scene.remove(this.scene.children[0]);
        "function" == typeof this.onRestart && this.onRestart(), this.init();
      }
      init() {
        "function" == typeof this.onInit && this.onInit();
      }
      destroy() {
        "function" == typeof this.onDestroy && this.onDestroy();
        const t = window.removeEventListener;
        t("touchstart", this.windowTouchWrapper),
          t("touchmove", this.windowTouchWrapper),
          t("scroll", this.windowMouseMoveWrapper),
          t("mousemove", this.windowMouseMoveWrapper),
          t("deviceorientation", this.windowGyroWrapper),
          t("resize", this.resize),
          window.cancelAnimationFrame(this.req);
        const e = this.scene;
        e && e.children && r(e),
          this.renderer &&
            (this.renderer.domElement &&
              this.el.removeChild(this.renderer.domElement),
            (this.renderer = null),
            (this.scene = null)),
          l.current === this && (l.current = null);
      }
    };
    const p = l.VantaBase;
    let d = "object" == typeof window && window.THREE;
    class u extends p {
      static initClass() {
        (this.prototype.defaultOptions = {
          backgroundColor: 2106408,
          color: 8978176,
        }),
          (this.prototype.colors = [
            16720469, 16716185, 16737996, 8978176, 7851025, 16776960, 16742195,
            1179647, 1149149, 16768290, 2250188, 7975100, 5468283,
          ]);
      }
      constructor(t) {
        (d = t.THREE || d), super(t);
      }
      material(t) {
        return new d.MeshLambertMaterial({ color: t });
      }
      genRing(t, e, i, r, h, a, l) {
        null == r && (r = 0),
          null == h && (h = 1.4 * Math.PI),
          null == a && (a = 0),
          null == l && (l = 1),
          this.rings || (this.rings = []),
          e < 1 && (e = 1);
        const c = {
            depth: 0.4,
            bevelEnabled: !1,
            steps: 1,
            curveSegments: ~~((64 * h) / 6.14),
          },
          p = new d.Shape();
        p.absarc(0, 0, e + i, 0, h, !1),
          p.lineTo(e * Math.cos(h), e * Math.sin(h)),
          p.absarc(0, 0, e, h, 0, !0);
        const u = new d.ExtrudeGeometry(p, c),
          m = this.material(t);
        (0 === n(0, 1) || e > 60) &&
          ((m.transparent = !0),
          (m.opacity = Math.max(50 / e + o(-0.3, 0.3), 0.1)));
        const f = new d.Mesh(u, m);
        if (
          ((f.rotation.x = Math.PI / 2),
          (f.rotation.z = r),
          (f.position.y = a),
          (f.speed = 0.003 * l),
          (f.receiveShadow = !0),
          (f.castShadow = !0),
          this.rings.push(f),
          this.cont.add(f),
          e < 20 && h < 1.3 * Math.PI && n(0, 2))
        )
          try {
            this.genRing(
              s(this.colors),
              e + o(-1, 3),
              i + o(-2, 0),
              r + h,
              h + o(-0.5, 0.5),
              a + o(-3, 1),
              l
            );
          } catch (t) {}
        return f;
      }
      onInit() {
        let t;
        const { material: e } = this;
        (this.cont = new d.Group()),
          this.cont.position.set(15, 0, 0),
          (this.cont.rotation.x = 0.06667),
          (this.cont.rotation.z = 0.16667),
          this.scene.add(this.cont);
        let r = i() ? 30 : 60;
        for (let e = 0; e < r; e++) {
          let e;
          n(0, 3)
            ? ((e = o(2, 4) + o(1, 30) * o(1, 2) * o(1, 2) * o(1, 2)),
              i() && (e *= 0.5),
              (t = o(0, 3.5) + o(0, 3.5) - n(0, e / 4) - e / 50))
            : ((e = o(1, 3) * o(2, 4)), (t = o(1, 2) * o(1, 2) * o(1.1, 1.5)));
          const r = 0.05 * Math.pow(2, n(0, 4));
          t < r && (t = r),
            this.genRing(
              s(this.colors),
              e,
              t,
              o(0, 1e3),
              o(1, 6),
              o(0, 50 / (e + 1) + 5) + 5 / t / (e + 0.5),
              0.25 * Math.max(-o(0.5, 2), o(1, 50 - e / 2) - e / 2)
            );
        }
        (this.camera = new d.PerspectiveCamera(
          25,
          this.width / this.height,
          10,
          1e4
        )),
          this.camera.position.set(0, 150, 200),
          this.scene.add(this.camera);
        const h = new d.AmbientLight(16777215, 0.5);
        return (
          this.scene.add(h),
          (this.pointLight = new d.PointLight(16777215, 0.5)),
          this.pointLight.position.set(0, 150, 200),
          this.scene.add(this.pointLight),
          (this.spot = new d.SpotLight(16777215, 1)),
          this.spot.position.set(-15, 50, 100),
          (this.spot.penumbra = 1),
          (this.spot.angle = 0.5),
          (this.spot.decay = 1),
          (this.spot.distance = 300),
          (this.spot.target = this.cont),
          this.scene.add(this.spot)
        );
      }
      onUpdate() {
        let t;
        null != this.helper && this.helper.update(),
          null != this.controls && this.controls.update();
        const e = this.camera;
        Math.abs(e.tx - e.position.x) > 0.01 &&
          ((t = e.tx - e.position.x), (e.position.x += 0.02 * t)),
          Math.abs(e.ty - e.position.y) > 0.01 &&
            ((t = e.ty - e.position.y), (e.position.y += 0.02 * t)),
          e.lookAt(new d.Vector3(0, 25, 27)),
          (e.near = Math.max(0.5 * e.position.z - 20, 1)),
          e.updateProjectionMatrix();
        for (let t of Array.from(null != this.rings ? this.rings : []))
          t.rotation.z += t.speed;
        const i = 0.001 * this.t;
        return (
          (this.cont.rotation.x += 1e-4 * Math.sin(i)),
          (this.cont.rotation.z += 7e-5 * Math.cos(i))
        );
      }
      onMouseMove(t, e) {
        const i = this.camera;
        return (
          i.oy || ((i.oy = i.position.y), (i.ox = i.position.x)),
          (i.tx = i.ox + 80 * (t - 0.5)),
          (i.ty = i.oy - 80 * e)
        );
      }
    }
    u.initClass();
    const m = l.register("RINGS", u);
    return e;
  })()
);
