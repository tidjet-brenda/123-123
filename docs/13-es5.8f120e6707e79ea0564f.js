!function(){function e(e,i){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var i=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==i)return;var n,r,a=[],o=!0,c=!1;try{for(i=i.call(e);!(o=(n=i.next()).done)&&(a.push(n.value),!t||a.length!==t);o=!0);}catch(s){c=!0,r=s}finally{try{o||null==i.return||i.return()}finally{if(c)throw r}}return a}(e,i)||function(e,i){if(!e)return;if("string"==typeof e)return t(e,i);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return t(e,i)}(e,i)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function t(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function r(e,t,i){return t&&n(e.prototype,t),i&&n(e,i),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{WzW6:function(t,n,a){"use strict";a.r(n),a.d(n,"LoginModule",function(){return se});var o=a("sYmb"),c=a("5HBU"),s=a("tyNb"),l=a("3Pt+"),u=a("PVWW"),p=a("JthR"),m=a("LhcL"),f=a("UnRD"),h=a("fXoL"),d=a("400s"),g=a("+VQX"),b=a("dTU2"),w=a("DD7I"),v=a("hLwh"),x=a("ofXK"),y=(a("LRne"),a("2Vo4"),a("XNiG")),k=new h.y("recaptcha-language"),S=new h.y("recaptcha-base-url"),j=new h.y("recaptcha-nonce-tag");new h.y("recaptcha-settings");var O,E,B=new h.y("recaptcha-v3-site-key"),Q=((E=function(){function t(n,r,a,o,c){var s=this;i(this,t),this.onLoadComplete=function(t){s.grecaptcha=t,s.actionBacklog&&s.actionBacklog.length>0&&(s.actionBacklog.forEach(function(t){var i=e(t,2),n=i[0],r=i[1];return s.executeActionWithSubject(n,r)}),s.actionBacklog=void 0)},this.zone=n,this.isBrowser=Object(x.A)(a),this.siteKey=r,this.nonce=c,this.baseUrl=o,this.init()}return r(t,[{key:"onExecute",get:function(){return this.onExecuteSubject||(this.onExecuteSubject=new y.a,this.onExecuteObservable=this.onExecuteSubject.asObservable()),this.onExecuteObservable}},{key:"execute",value:function(e){var t=new y.a;return this.isBrowser&&(this.grecaptcha?this.executeActionWithSubject(e,t):(this.actionBacklog||(this.actionBacklog=[]),this.actionBacklog.push([e,t]))),t.asObservable()}},{key:"executeActionWithSubject",value:function(e,t){var i=this;this.zone.runOutsideAngular(function(){i.grecaptcha.execute(i.siteKey,{action:e}).then(function(n){i.zone.run(function(){t.next(n),t.complete(),i.onExecuteSubject&&i.onExecuteSubject.next({action:e,token:n})})})})}},{key:"init",value:function(){this.isBrowser&&("grecaptcha"in window?this.grecaptcha=grecaptcha:function(e,t,i,n,r){window.ng2recaptchaloaded=function(){t(grecaptcha)};var a=document.createElement("script");a.innerHTML="",a.src="".concat(n||"https://www.google.com/recaptcha/api.js","?render=").concat(e,"&onload=ng2recaptchaloaded"),r&&(a.nonce=r),a.async=!0,a.defer=!0,document.head.appendChild(a)}(this.siteKey,this.onLoadComplete,0,this.baseUrl,this.nonce))}}]),t}()).\u0275fac=function(e){return new(e||E)(h.mc(h.J),h.mc(B),h.mc(h.M),h.mc(S,8),h.mc(j,8))},E.\u0275prov=h.Yb({token:E,factory:function(e){return E.\u0275fac(e)}}),E=Object(v.__decorate)([Object(v.__param)(1,Object(h.v)(B)),Object(v.__param)(2,Object(h.v)(h.M)),Object(v.__param)(3,Object(h.K)()),Object(v.__param)(3,Object(h.v)(S)),Object(v.__param)(4,Object(h.K)()),Object(v.__param)(4,Object(h.v)(j)),Object(v.__metadata)("design:paramtypes",[h.J,String,Object,String,String])],E)),A=((O=function e(){i(this,e)}).\u0275fac=function(e){return new(e||O)},O.\u0275mod=h.ac({type:O}),O.\u0275inj=h.Zb({providers:[Q]}),O),C=a("p4AF"),L=a("gPJw"),_=a("B9zo"),I=a("XiUz"),M=a("znSr"),q=a("7h/2"),z=a("EwFO"),T=a("kmnG"),V=a("qFsG"),R=a("NFeN"),Z=a("bTqV"),G=a("bSwM"),N=["captchaRef"];function P(e,t){1&e&&(h.ic(0,"mat-error"),h.bd(1),h.vc(2,"translate"),h.hc()),2&e&&(h.Qb(1),h.dd(" ",h.wc(2,1,"authentification.required")," "))}function U(e,t){1&e&&(h.ic(0,"mat-error"),h.bd(1),h.vc(2,"translate"),h.hc()),2&e&&(h.Qb(1),h.dd(" ",h.wc(2,1,"authentification.emailNoVliade")," "))}function W(e,t){1&e&&(h.ic(0,"mat-error"),h.bd(1),h.vc(2,"translate"),h.hc()),2&e&&(h.Qb(1),h.dd(" ",h.wc(2,1,"authentification.required")," "))}function K(e,t){1&e&&(h.ic(0,"mat-error"),h.bd(1),h.vc(2,"translate"),h.hc()),2&e&&(h.Qb(1),h.dd(" ",h.wc(2,1,"authentification.pwdLength")," "))}function D(e,t){if(1&e&&(h.ic(0,"mat-error",19),h.bd(1),h.vc(2,"translate"),h.vc(3,"translate"),h.hc()),2&e){var i=h.uc();h.Qb(1),h.fd(" ",h.wc(2,3,"authentification.remain")," ",i.index," ",h.wc(3,5,"authentification.attempts")," ")}}function F(e,t){if(1&e&&(h.ic(0,"mat-error",19),h.bd(1),h.vc(2,"translate"),h.vc(3,"translate"),h.hc()),2&e){var i=h.uc();h.Qb(1),h.fd(" ",h.wc(2,3,"authentification.remain")," ",i.index," ",h.wc(3,5,"authentification.attempt")," ")}}var J,X,H=function(){return{delay:"300ms",x:"100%"}},Y=function(e){return{value:"*",params:e}},$=function(){return["/forgot-password"]},ee=function(e){return{email:e}},te=function(e){return{"sirh-disabled-btn":e}},ie=((J=function(){function e(t,n,r,a,o,c,s,u,p,m){i(this,e),this.authService=t,this.route=n,this.router=r,this.authGuardService=a,this.refService=o,this.userService=c,this.recaptchaV3Service=s,this.snackBarService=u,this.translateService=p,this.fuseLoaderTranslateService=m,this.emailControl=new l.e("",[l.t.required,l.t.pattern("^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$")]),this.passwordControl=new l.e("",[l.t.required,l.t.minLength(8)]),this.hide=!0,this.fault=!0,this.rememberMeValue=!1,this.index=6,this.form=new l.h({email:this.emailControl,password:this.passwordControl})}return r(e,[{key:"ngOnDestroy",value:function(){this.singleExecutionSubscription&&this.singleExecutionSubscription.unsubscribe()}},{key:"ngOnInit",value:function(){this.fuseLoaderTranslateService.loadTranslations(m.a,f.a)}},{key:"changeRememberMe",value:function(e){this.rememberMeValue=e.checked}},{key:"executeAction",value:function(e,t){var i=this;this.singleExecutionSubscription&&this.singleExecutionSubscription.unsubscribe(),this.singleExecutionSubscription=this.recaptchaV3Service.execute(e).subscribe(function(e){return i.login(e)})}},{key:"login",value:function(e){var t=this;if(this.form.valid){var i={username:this.form.get("email").value,password:this.form.get("password").value,rememberMe:this.rememberMeValue};this.authService.login(i,e).subscribe(function(e){t.authGuardService.checkRoles(e.access_token)?(p.a.setUser(e),p.a.setAuthToken(e.role),p.a.setAuthToken(e.access_token),t.authService.isConnected=!0,t.route.navigate([""])):t.snackBarService.showSnackBar(t.translateService.instant("authentification.unAuthorized"),t.snackBarService.errorSnackBarClass,!0)},function(e){t.index=t.index-1,t.authService.setAuthenticated(!1)})}}},{key:"emailTrimer",value:function(){this.form.get("email").setValue(this.form.get("email").value.trim())}}]),e}()).\u0275fac=function(e){return new(e||J)(h.cc(d.a),h.cc(s.g),h.cc(s.a),h.cc(g.a),h.cc(b.a),h.cc(w.a),h.cc(Q),h.cc(C.a),h.cc(o.d),h.cc(L.a))},J.\u0275cmp=h.Wb({type:J,selectors:[["app-login"]],viewQuery:function(e,t){var i;1&e&&h.hd(N,1),2&e&&h.Mc(i=h.rc())&&(t.recaptcha=i.first)},decls:42,vars:42,consts:[["id","login","fxLayout","row","fxLayoutAlign","start",1,"inner-scroll"],["id","login-intro","fxFlex","","fxHide","","fxShow.gt-xs",""],["id","login-form-wrapper","fusePerfectScrollbar",""],["id","login-form"],["fxHide.gt-xs","",1,"logo"],["src","../../../../assets/images/logos/Calque 1.png","alt","Logo PORTAIL-EMPLOYE"],[1,"title"],["name","loginForm","novalidate","","autocomplete","off",3,"formGroup"],["appearance","outline"],["matInput","","formControlName","email",3,"input"],["matSuffix","",1,"secondary-text"],[4,"ngIf"],["matInput","","formControlName","password",3,"type"],["mat-icon-button","","matSuffix","",3,"click"],["class","mat-error",4,"ngIf"],["fxLayout","row","fxLayout.sm","column","fxLayout.xs","column","fxLayoutAlign","space-between center",1,"remember-forgot-password"],["aria-label","Remember Me",1,"remember-me",3,"change"],[1,"forgot-password",3,"routerLink","state"],["mat-raised-button","","aria-label","LOGIN",1,"submit-button","sirh-validate-btn",3,"disabled","ngClass","click"],[1,"mat-error"]],template:function(e,t){1&e&&(h.ic(0,"div",0),h.ic(1,"div",1),h.dc(2,"home-page"),h.hc(),h.ic(3,"div",2),h.ic(4,"div",3),h.ic(5,"div",4),h.dc(6,"img",5),h.hc(),h.ic(7,"div",6),h.bd(8),h.vc(9,"translate"),h.hc(),h.ic(10,"form",7),h.ic(11,"mat-form-field",8),h.ic(12,"mat-label"),h.bd(13),h.vc(14,"translate"),h.hc(),h.ic(15,"input",9),h.qc("input",function(){return t.emailTrimer()}),h.hc(),h.ic(16,"mat-icon",10),h.bd(17,"mail"),h.hc(),h.Zc(18,P,3,3,"mat-error",11),h.Zc(19,U,3,3,"mat-error",11),h.hc(),h.ic(20,"mat-form-field",8),h.ic(21,"mat-label"),h.bd(22),h.vc(23,"translate"),h.hc(),h.dc(24,"input",12),h.ic(25,"button",13),h.qc("click",function(){return t.hide=!t.hide}),h.ic(26,"mat-icon"),h.bd(27),h.hc(),h.hc(),h.Zc(28,W,3,3,"mat-error",11),h.Zc(29,K,3,3,"mat-error",11),h.hc(),h.Zc(30,D,4,7,"mat-error",14),h.Zc(31,F,4,7,"mat-error",14),h.ic(32,"div",15),h.ic(33,"mat-checkbox",16),h.qc("change",function(e){return t.changeRememberMe(e)}),h.bd(34),h.vc(35,"translate"),h.hc(),h.ic(36,"a",17),h.bd(37),h.vc(38,"translate"),h.hc(),h.hc(),h.ic(39,"button",18),h.qc("click",function(e){return t.executeAction("login",e)}),h.bd(40),h.vc(41,"translate"),h.hc(),h.hc(),h.hc(),h.hc(),h.hc()),2&e&&(h.Qb(3),h.Bc("@animate",h.Ec(35,Y,h.Dc(34,H))),h.Qb(5),h.cd(h.wc(9,22,"authentification.connect")),h.Qb(2),h.Bc("formGroup",t.form),h.Qb(3),h.cd(h.wc(14,24,"authentification.adress")),h.Qb(5),h.Bc("ngIf",t.emailControl.hasError("required")),h.Qb(1),h.Bc("ngIf",!t.emailControl.hasError("required")&&t.emailControl.hasError("pattern")),h.Qb(3),h.cd(h.wc(23,26,"authentification.pwd")),h.Qb(2),h.Bc("type",t.hide?"password":"text"),h.Qb(1),h.Rb("aria-label","Hide password")("aria-pressed",t.hide),h.Qb(2),h.cd(t.hide?"visibility_off":"visibility"),h.Qb(1),h.Bc("ngIf",t.passwordControl.hasError("required")),h.Qb(1),h.Bc("ngIf",!t.passwordControl.hasError("required")&&t.passwordControl.hasError("minlength")),h.Qb(1),h.Bc("ngIf",2===t.index),h.Qb(1),h.Bc("ngIf",1===t.index),h.Qb(3),h.dd(" ",h.wc(35,28,"authentification.rememberMe")," "),h.Qb(2),h.Bc("routerLink",h.Dc(37,$))("state",h.Ec(38,ee,t.form.controls.email.value)),h.Qb(1),h.dd(" ",h.wc(38,30,"authentification.forgotPsw")," "),h.Qb(2),h.Bc("disabled",t.form.invalid)("ngClass",h.Ec(40,te,t.form.invalid)),h.Qb(1),h.dd(" ",h.wc(41,32,"authentification.getConnect")," "))},directives:[_.a,I.c,I.b,I.a,M.b,q.a,z.a,l.u,l.p,l.i,T.c,T.g,V.b,l.c,l.o,l.g,R.a,T.h,x.n,Z.b,G.a,s.i,x.k,M.a,T.b],pipes:[o.c],styles:["app-login{width:100%}app-login #login{width:100%;height:100%;overflow:hidden;background:url(/assets/images/backgrounds/dark-material-bg.jpg) no-repeat;background-size:cover}app-login #login #login-form-wrapper{width:400px;min-width:400px;max-width:400px;overflow:auto;-webkit-overflow-scrolling:touch;background:#fff;box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)}@media screen and (min-width:600px) and (max-width:959px){app-login #login #login-form-wrapper{width:360px;min-width:360px;max-width:360px}}@media screen and (max-width:599px){app-login #login #login-form-wrapper{width:100%;min-width:100%;max-width:100%}}app-login #login #login-form-wrapper #login-form{padding:48px;margin-top:30px}@media screen and (max-width:599px){app-login #login #login-form-wrapper #login-form{text-align:center;padding:24px}}app-login #login #login-form-wrapper #login-form .logo{width:128px;margin:32px auto}app-login #login #login-form-wrapper #login-form .title{font-size:21px;text-align:center;margin-bottom:15px}app-login #login #login-form-wrapper #login-form .description{padding-top:8px}app-login #login #login-form-wrapper #login-form form{width:100%;padding-top:32px}app-login #login #login-form-wrapper #login-form form mat-form-field{width:100%}@media screen and (max-width:599px){app-login #login #login-form-wrapper #login-form form mat-form-field{width:80%}}app-login #login #login-form-wrapper #login-form form mat-checkbox{margin:0}app-login #login #login-form-wrapper #login-form form .remember-forgot-password{font-size:13px;margin-top:8px}app-login #login #login-form-wrapper #login-form form .remember-forgot-password .remember-me{margin-bottom:16px}app-login #login #login-form-wrapper #login-form form .remember-forgot-password .forgot-password{font-size:13px;margin-bottom:11px}app-login #login #login-form-wrapper #login-form form .submit-button{width:100%;margin:16px auto;display:block}@media screen and (max-width:599px){app-login #login #login-form-wrapper #login-form form .submit-button{width:80%}}"],encapsulation:2,data:{animation:u.a}}),J),ne=a("STbY"),re=a("AytR"),ae=a("jg9X"),oe=re.a.reCaptcheKey,ce=[{path:"",component:ie}],se=((X=function e(){i(this,e)}).\u0275fac=function(e){return new(e||X)},X.\u0275mod=h.ac({type:X}),X.\u0275inj=h.Zb({providers:[{provide:k,useValue:"fr"},{provide:B,useValue:oe}],imports:[[s.j.forChild(ce),Z.c,G.b,T.e,R.b,V.c,ne.c,c.a,o.b,A,ae.a]]}),X)}}])}();