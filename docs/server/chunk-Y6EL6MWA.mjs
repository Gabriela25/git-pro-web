import './polyfills.server.mjs';
import{a as N,b as C,c as q,d as G,e as D,f as F,g as M,h as R,i as V,j as k}from"./chunk-RQKVUPXT.mjs";import{b as h,c as T,d as B}from"./chunk-QDT7BEQY.mjs";import{x as I}from"./chunk-NKDAZJ5I.mjs";import{$a as S,Ja as _,La as x,Na as g,Oa as n,Pa as t,Qa as f,Sa as y,Ta as w,V as b,Za as a,_a as v,bb as E,cb as r,db as m,wa as i}from"./chunk-2E6YTQ7Q.mjs";import"./chunk-VVCT4QZE.mjs";function L(e,l){e&1&&(n(0,"span"),a(1),r(2,"translate"),t()),e&2&&(i(),S(" ",m(2,1,"sign-in.isEmailRequired")," "))}function j(e,l){e&1&&(n(0,"span"),a(1),r(2,"translate"),t()),e&2&&(i(),S(" ",m(2,1,"sign-in.isEmailValid")," "))}function P(e,l){if(e&1&&(n(0,"div",8),_(1,L,3,3,"span")(2,j,3,3,"span"),t()),e&2){let d,p,s=w();i(),g(1,!((d=s.loginForm.get("email"))==null||d.errors==null)&&d.errors.required?1:-1),i(),g(2,!((p=s.loginForm.get("email"))==null||p.errors==null)&&p.errors.email?2:-1)}}function A(e,l){e&1&&(n(0,"span"),a(1),r(2,"translate"),t()),e&2&&(i(),S(" ",m(2,1,"sign-in.isPasswordRequired")," "))}function H(e,l){if(e&1&&(n(0,"div",8),_(1,A,3,3,"span"),t()),e&2){let d,p=w();i(),g(1,!((d=p.loginForm.get("password"))==null||d.errors==null)&&d.errors.required?1:-1)}}var X=(()=>{let l=class l{constructor(){this.loginForm=new D({email:new F("",[C.required,C.email]),password:new F("",[C.required])})}onSubmit(){console.warn(this.loginForm.value)}};l.\u0275fac=function(s){return new(s||l)},l.\u0275cmp=b({type:l,selectors:[["app-sing-in"]],standalone:!0,features:[E],decls:31,vars:19,consts:[[1,"container","p-5"],[1,"row"],[1,"col"],[1,"col-12","col-md-6","p-3","col-login","text-light-emphasis"],["autocomplete","off",3,"ngSubmit","formGroup"],[1,"mb-3"],["for","email",1,"form-label","fw-bold"],["type","email","id","email","placeholder","Email","type","email","formControlName","email",1,"form-control"],[1,"alert","alert-danger","mt-2"],["for","password",1,"form-label","fw-bold"],["type","password","id","password","placeholder","","type","password","formControlName","password",1,"form-control"],[1,"mb-3","d-flex","justify-content-end"],["routerLink","/sign-in/password-recovery",1,"no-underline"],[1,"d-grid"],["type","submit",1,"btn","btn-primary",3,"disabled"],[1,"mt-3","d-flex","justify-content-center"],["routerLink","/sign-in/register","aria-current","page",1,"no-underline"]],template:function(s,o){if(s&1&&(f(0,"app-header"),n(1,"div",0)(2,"div",1),f(3,"div",2),n(4,"div",3)(5,"form",4),y("ngSubmit",function(){return o.onSubmit()}),n(6,"div",5)(7,"label",6),a(8),r(9,"translate"),t(),f(10,"input",7),_(11,P,3,2,"div",8),t(),n(12,"div",5)(13,"label",9),a(14),r(15,"translate"),t(),f(16,"input",10),_(17,H,2,1,"div",8),t(),n(18,"div",11)(19,"a",12),a(20),r(21,"translate"),t()(),n(22,"div",13)(23,"button",14),a(24),r(25,"translate"),t()(),n(26,"div",15)(27,"a",16),a(28),r(29,"translate"),t()()()(),f(30,"div",2),t()()),s&2){let u,c;i(5),x("formGroup",o.loginForm),i(3),v(m(9,9,"sign-in.email")),i(3),g(11,(u=o.loginForm.get("email"))!=null&&u.invalid&&((u=o.loginForm.get("email"))!=null&&u.dirty||(u=o.loginForm.get("email"))!=null&&u.touched)?11:-1),i(3),v(m(15,11,"sign-in.password")),i(3),g(17,(c=o.loginForm.get("password"))!=null&&c.invalid&&((c=o.loginForm.get("password"))!=null&&c.dirty||(c=o.loginForm.get("password"))!=null&&c.touched)?17:-1),i(3),v(m(21,13,"sign-in.forgotpassword")),i(3),x("disabled",!o.loginForm.valid),i(),v(m(25,15,"sign-in.log-in")),i(4),v(m(29,17,"sign-in.register"))}},dependencies:[k,M,N,q,G,R,V,T,h,I,B]});let e=l;return e})();export{X as default};
