import './polyfills.server.mjs';
import{a as I,b as N,c as G,d as D,e as M,f as w,g as V,h as L,i as k,j as P}from"./chunk-RQKVUPXT.mjs";import{b as T,c as q,d as B}from"./chunk-QDT7BEQY.mjs";import{x as h}from"./chunk-NKDAZJ5I.mjs";import{$a as F,Ja as u,La as S,Na as p,Oa as n,Pa as i,Qa as c,Sa as y,Ta as b,V as E,Za as o,_a as _,bb as R,cb as m,db as d,wa as t}from"./chunk-2E6YTQ7Q.mjs";import"./chunk-VVCT4QZE.mjs";function j(e,l){e&1&&(n(0,"span"),o(1),m(2,"translate"),i()),e&2&&(t(),F(" ",d(2,1,"sign-in.isFirstNameRequired")," "))}function A(e,l){if(e&1&&(n(0,"div",9),u(1,j,3,3,"span"),i()),e&2){let r,s=b();t(),p(1,!((r=s.registerForm.get("firstName"))==null||r.errors==null)&&r.errors.required?1:-1)}}function H(e,l){e&1&&(n(0,"span"),o(1),m(2,"translate"),i()),e&2&&(t(),F(" ",d(2,1,"sign-in.isLastNameRequired")," "))}function z(e,l){if(e&1&&(n(0,"div",12),u(1,H,3,3,"span"),i()),e&2){let r,s=b();t(),p(1,!((r=s.registerForm.get("lastName"))==null||r.errors==null)&&r.errors.required?1:-1)}}function J(e,l){e&1&&(n(0,"span"),o(1),m(2,"translate"),i()),e&2&&(t(),F(" ",d(2,1,"sign-in.isEmailRequired")," "))}function K(e,l){e&1&&(n(0,"span"),o(1),m(2,"translate"),i()),e&2&&(t(),F(" ",d(2,1,"sign-in.isEmailValid")," "))}function O(e,l){if(e&1&&(n(0,"div",12),u(1,J,3,3,"span")(2,K,3,3,"span"),i()),e&2){let r,s,g=b();t(),p(1,!((r=g.registerForm.get("email"))==null||r.errors==null)&&r.errors.required?1:-1),t(),p(2,!((s=g.registerForm.get("email"))==null||s.errors==null)&&s.errors.email?2:-1)}}function Q(e,l){e&1&&(n(0,"span"),o(1),m(2,"translate"),i()),e&2&&(t(),F(" ",d(2,1,"sign-in.isPasswordRequired")," "))}function U(e,l){if(e&1&&(n(0,"div",12),u(1,Q,3,3,"span"),i()),e&2){let r,s=b();t(),p(1,!((r=s.registerForm.get("password"))==null||r.errors==null)&&r.errors.required?1:-1)}}var ie=(()=>{let l=class l{constructor(){this.registerForm=new M({firstName:new w("",[N.required]),lastName:new w("",[N.required]),email:new w("",[N.required,N.email]),password:new w("",[N.required])})}onSubmit(){console.warn(this.registerForm.value)}};l.\u0275fac=function(g){return new(g||l)},l.\u0275cmp=E({type:l,selectors:[["app-register"]],standalone:!0,features:[R],decls:40,vars:24,consts:[[1,"container","p-5"],[1,"row"],[1,"col"],[1,"col-12","col-md-6","p-3","col-login","text-light-emphasis"],["autocomplete","off",3,"ngSubmit","formGroup"],[1,"row","mb-3"],[1,"col-12","col-md-6"],["for","firstName",1,"form-label","fw-bold"],["type","text","placeholder","","id","firstName","type","firstName","formControlName","firstName",1,"form-control"],[1,"alert","alert-danger","mt-2","mt-2"],["for","lastName",1,"form-label","fw-bold"],["type","text","placeholder","","id","lastName","type","lastName","formControlName","lastName",1,"form-control"],[1,"alert","alert-danger","mt-2"],[1,"mb-3"],["for","email",1,"form-label","fw-bold"],["type","email","id","email","placeholder","Email","type","email","formControlName","email",1,"form-control"],["for","password",1,"form-label","fw-bold"],["type","password","id","password","placeholder","","type","password","formControlName","password",1,"form-control"],[1,"d-grid"],["type","submit",1,"btn","btn-primary",3,"disabled"],[1,"mt-3","d-flex","justify-content-center"],["routerLink","/sign-in","aria-current","page",1,"no-underline"]],template:function(g,a){if(g&1&&(c(0,"app-header"),n(1,"div",0)(2,"div",1),c(3,"div",2),n(4,"div",3)(5,"form",4),y("ngSubmit",function(){return a.onSubmit()}),n(6,"div",5)(7,"div",6)(8,"label",7),o(9),m(10,"translate"),i(),c(11,"input",8),u(12,A,2,1,"div",9),i(),n(13,"div",6)(14,"label",10),o(15),m(16,"translate"),i(),c(17,"input",11),u(18,z,2,1,"div",12),i()(),n(19,"div",13)(20,"label",14),o(21),m(22,"translate"),i(),c(23,"input",15),u(24,O,3,2,"div",12),i(),n(25,"div",13)(26,"label",16),o(27),m(28,"translate"),i(),c(29,"input",17),u(30,U,2,1,"div",12),i(),n(31,"div",18)(32,"button",19),o(33),m(34,"translate"),i()(),n(35,"div",20)(36,"a",21),o(37),m(38,"translate"),i()()()(),c(39,"div",2),i()()),g&2){let f,v,C,x;t(5),S("formGroup",a.registerForm),t(4),_(d(10,12,"sign-in.first-name")),t(3),p(12,(f=a.registerForm.get("firstName"))!=null&&f.invalid&&((f=a.registerForm.get("firstName"))!=null&&f.dirty||(f=a.registerForm.get("firstName"))!=null&&f.touched)?12:-1),t(3),_(d(16,14,"sign-in.last-name")),t(3),p(18,(v=a.registerForm.get("lastName"))!=null&&v.invalid&&((v=a.registerForm.get("lastName"))!=null&&v.dirty||(v=a.registerForm.get("lastName"))!=null&&v.touched)?18:-1),t(3),_(d(22,16,"sign-in.email")),t(3),p(24,(C=a.registerForm.get("email"))!=null&&C.invalid&&((C=a.registerForm.get("email"))!=null&&C.dirty||(C=a.registerForm.get("email"))!=null&&C.touched)?24:-1),t(3),_(d(28,18,"sign-in.password")),t(3),p(30,(x=a.registerForm.get("password"))!=null&&x.invalid&&((x=a.registerForm.get("password"))!=null&&x.dirty||(x=a.registerForm.get("password"))!=null&&x.touched)?30:-1),t(2),S("disabled",!a.registerForm.valid),t(),_(d(34,20,"sign-in.register")),t(4),_(d(38,22,"sign-in.sign-in"))}},dependencies:[P,V,I,G,D,L,k,q,T,h,B]});let e=l;return e})();export{ie as default};
