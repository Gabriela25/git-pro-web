import{a as T,b as P,c as q,d as G,e as M,f as S,g as A,h as R,i as V,j as z}from"./chunk-ADBCT2FO.js";import{i as N,l as y,m as B,n as I}from"./chunk-TMV2ZA7Z.js";import{Ea as v,Ga as b,Ia as u,Ja as i,Ka as n,La as _,Na as F,Oa as C,U as E,Ua as o,Va as p,Wa as g,Ya as h,Za as a,_a as l,sa as t}from"./chunk-HHBFI37K.js";import"./chunk-TMC7WMLO.js";function D(e,s){e&1&&(i(0,"span"),o(1),a(2,"translate"),n()),e&2&&(t(),g(" ",l(2,1,"sign-in.isPasswordRequired")," "))}function Z(e,s){if(e&1&&(i(0,"div",8),v(1,D,3,3,"span"),n()),e&2){let c,m=C();t(),u(1,!((c=m.passwordForm.get("currentPassword"))==null||c.errors==null)&&c.errors.required?1:-1)}}function k(e,s){e&1&&(i(0,"span"),o(1),a(2,"translate"),n()),e&2&&(t(),g(" ",l(2,1,"sign-in.isPasswordRequired")," "))}function L(e,s){e&1&&(i(0,"ul")(1,"li"),o(2),a(3,"translate"),n(),i(4,"li"),o(5),a(6,"translate"),n(),i(7,"li"),o(8),a(9,"translate"),n(),i(10,"li"),o(11),a(12,"translate"),n()()),e&2&&(t(2),p(l(3,4,"sign-in.minimum-8-characters")),t(3),p(l(6,6,"sign-in.maximum-15-characters")),t(3),p(l(9,8,"sign-in.at-least-one-uppercase-letter")),t(3),p(l(12,10,"sign-in.one-lowercase-letter-and-one-number")))}function $(e,s){if(e&1&&(i(0,"div",8),v(1,k,3,3,"span")(2,L,13,12,"ul"),n()),e&2){let c,m,d=C();t(),u(1,!((c=d.passwordForm.get("newPassword"))==null||c.errors==null)&&c.errors.required?1:-1),t(),u(2,!((m=d.passwordForm.get("newPassword"))==null||m.errors==null)&&m.errors.pattern?2:-1)}}function j(e,s){e&1&&(i(0,"span"),o(1),a(2,"translate"),n()),e&2&&(t(),g(" ",l(2,1,"sign-in.isPasswordRequired")," "))}function H(e,s){e&1&&(i(0,"ul")(1,"li"),o(2),a(3,"translate"),n(),i(4,"li"),o(5),a(6,"translate"),n(),i(7,"li"),o(8),a(9,"translate"),n(),i(10,"li"),o(11),a(12,"translate"),n()()),e&2&&(t(2),p(l(3,4,"sign-in.minimum-8-characters")),t(3),p(l(6,6,"sign-in.maximum-15-characters")),t(3),p(l(9,8,"sign-in.at-least-one-uppercase-letter")),t(3),p(l(12,10,"sign-in.one-lowercase-letter-and-one-number")))}function J(e,s){e&1&&(i(0,"span"),o(1),a(2,"translate"),n()),e&2&&(t(),g(" ",l(2,1,"sign-in.the-passwords-do-not-match")," "))}function K(e,s){if(e&1&&(i(0,"div",8),v(1,j,3,3,"span")(2,H,13,12,"ul")(3,J,3,3,"span"),n()),e&2){let c,m,d,r=C();t(),u(1,!((c=r.passwordForm.get("confirmNewPassword"))==null||c.errors==null)&&c.errors.required?1:-1),t(),u(2,!((m=r.passwordForm.get("newPassword"))==null||m.errors==null)&&m.errors.pattern?2:-1),t(),u(3,!((d=r.passwordForm.get("confirmNewPassword"))==null||d.errors==null)&&d.errors.mismatch?3:-1)}}var te=(()=>{let s=class s{constructor(){this.passwordForm=new M({currentPassword:new S("",[P.required]),newPassword:new S("",[P.required,P.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/)]),confirmNewPassword:new S("",[P.required,P.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/)])},{validators:this.passwordMatchValidator})}passwordMatchValidator(m){let d=m,r=d.get("newPassword").value,w=d.get("confirmNewPassword").value,f=d.get("confirmNewPassword");return r===w?(f?.setErrors(null),null):(f?.setErrors({mismatch:!0}),{mismatch:!0})}onSubmit(){console.warn(this.passwordForm.value)}};s.\u0275fac=function(d){return new(d||s)},s.\u0275cmp=E({type:s,selectors:[["app-password"]],standalone:!0,features:[h],decls:33,vars:20,consts:[[1,"container","p-5"],[1,"row"],[1,"col"],[1,"col-12","col-md-6","p-3","col-login","text-light-emphasis"],["autocomplete","off",3,"ngSubmit","formGroup"],[1,"mb-3"],["for","currentPassword",1,"form-label","fw-bold"],["type","password","id","currentPassword","placeholder","","type","password","formControlName","currentPassword",1,"form-control"],[1,"alert","alert-danger","mt-2"],["for","newPassword",1,"form-label","fw-bold"],["type","password","id","newPassword","placeholder","","type","password","formControlName","newPassword",1,"form-control"],["for","confirmNewPassword",1,"form-label","fw-bold"],["type","password","id","confirmNewPassword","placeholder","","type","password","formControlName","confirmNewPassword",1,"form-control"],[1,"d-flex","justify-content-end"],["type","button","routerLink","/customer/profile",1,"btn","btn-primary"],[1,"mx-2"],["type","submit",1,"btn","btn-primary",3,"disabled"]],template:function(d,r){if(d&1&&(_(0,"app-header"),i(1,"div",0)(2,"div",1),_(3,"div",2),i(4,"div",3)(5,"form",4),F("ngSubmit",function(){return r.onSubmit()}),i(6,"div",5)(7,"label",6),o(8),a(9,"translate"),n(),_(10,"input",7),v(11,Z,2,1,"div",8),n(),i(12,"div",5)(13,"label",9),o(14),a(15,"translate"),n(),_(16,"input",10),v(17,$,3,2,"div",8),n(),i(18,"div",5)(19,"label",11),o(20),a(21,"translate"),n(),_(22,"input",12),v(23,K,4,3,"div",8),n(),i(24,"div",13)(25,"button",14),o(26),a(27,"translate"),n(),_(28,"div",15),i(29,"button",16),o(30),a(31,"translate"),n()()()(),_(32,"div",2),n()()),d&2){let w,f,x;t(5),b("formGroup",r.passwordForm),t(3),p(l(9,10,"sign-in.current-password")),t(3),u(11,(w=r.passwordForm.get("currentPassword"))!=null&&w.invalid&&((w=r.passwordForm.get("currentPassword"))!=null&&w.dirty||(w=r.passwordForm.get("currentPassword"))!=null&&w.touched)?11:-1),t(3),p(l(15,12,"sign-in.new-password")),t(3),u(17,(f=r.passwordForm.get("newPassword"))!=null&&f.invalid&&((f=r.passwordForm.get("newPassword"))!=null&&f.dirty||(f=r.passwordForm.get("newPassword"))!=null&&f.touched)?17:-1),t(3),p(l(21,14,"sign-in.confirm-new-password")),t(3),u(23,(x=r.passwordForm.get("confirmNewPassword"))!=null&&x.invalid&&((x=r.passwordForm.get("confirmNewPassword"))!=null&&x.dirty||(x=r.passwordForm.get("confirmNewPassword"))!=null&&x.touched)?23:-1),t(3),p(l(27,16,"config.cancel")),t(3),b("disabled",!r.passwordForm.valid),t(),p(l(31,18,"config.save"))}},dependencies:[z,A,T,q,G,R,V,B,y,N,I]});let e=s;return e})();export{te as default};
