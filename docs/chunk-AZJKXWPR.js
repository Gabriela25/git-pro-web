import{a as q,b as _,c as G,d as P,e as D,f as x,g as M,h as R,i as L,j as V}from"./chunk-QT4PKCEW.js";import{i as w,l as I,m as B,n as T}from"./chunk-PIJ25363.js";import{Da as v,Fa as S,Ha as g,La as i,Ma as e,Na as s,Pa as y,Qa as h,T as C,Ta as F,Ya as l,Za as u,_a as N,ab as E,cb as o,db as m,ra as t}from"./chunk-OXS3PQF6.js";import"./chunk-KFZQC3P5.js";function j(n,a){n&1&&(i(0,"span"),l(1),o(2,"translate"),e()),n&2&&(t(),N(" ",m(2,1,"sign-in.isFirstNameRequired")," "))}function k(n,a){if(n&1&&(i(0,"div",19),v(1,j,3,3,"span"),e()),n&2){let d,c=h();t(),g(!((d=c.registerForm.get("firstName"))==null||d.errors==null)&&d.errors.required?1:-1)}}function A(n,a){n&1&&(i(0,"span"),l(1),o(2,"translate"),e()),n&2&&(t(),N(" ",m(2,1,"sign-in.isLastNameRequired")," "))}function H(n,a){if(n&1&&(i(0,"div",22),v(1,A,3,3,"span"),e()),n&2){let d,c=h();t(),g(!((d=c.registerForm.get("lastName"))==null||d.errors==null)&&d.errors.required?1:-1)}}var X=(()=>{let a=class a{constructor(){this.firtsName="Gabriela",this.email="gabrielabarreto25@gmail.com",this.registerForm=new D({firstName:new x("",[_.required]),lastName:new x("",[_.required]),phone:new x("",[_.required])})}onSubmit(){console.warn(this.registerForm.value)}};a.\u0275fac=function(b){return new(b||a)},a.\u0275cmp=C({type:a,selectors:[["app-profile"]],standalone:!0,features:[E],decls:62,vars:25,consts:[[1,"container-fluid"],[1,"row"],[1,"col-md-3","p-5"],[1,"col"],[1,"card",2,"width","15rem"],["src","assets/logo1.png","alt","...","width","15rem","height","150",1,"card-img-top"],[1,"card-body"],[1,"d-flex","justify-content-around"],[1,"text-center"],[1,"col","pt-3"],[1,"list-group","list-group-flush"],[1,"list-group-item"],["routerLink","/sign-in/password",1,"no-underline"],[1,"col-md-8","p-5"],["autocomplete","off",3,"ngSubmit","formGroup"],[1,"row","mb-3"],[1,"col-12","col-md-6"],["for","firstName",1,"form-label","fw-bold"],["type","text","placeholder","","id","firstName","type","firstName","formControlName","firstName",1,"form-control"],[1,"alert","alert-danger","mt-2","mt-2"],["for","lastName",1,"form-label","fw-bold"],["type","text","placeholder","","id","lastName","type","lastName","formControlName","lastName",1,"form-control"],[1,"alert","alert-danger","mt-2"],[1,"mb-3"],["for","email",1,"form-label","fw-bold"],["type","email","id","email","type","email","readonly","",1,"form-control",3,"value"],["for","phone",1,"form-label","fw-bold"],["type","phone","id","phone","placeholder","","type","phone","formControlName","phone",1,"form-control"],[1,"d-flex","justify-content-end"],["type","submit",1,"btn","btn-primary",3,"disabled"]],template:function(b,r){if(b&1&&(s(0,"app-header"),i(1,"div",0)(2,"div",1)(3,"div",2)(4,"div",1)(5,"div",3)(6,"div",4),s(7,"img",5),i(8,"div",6)(9,"div",7)(10,"div")(11,"span"),l(12),e()(),i(13,"div")(14,"span"),l(15),e()()(),i(16,"div",8)(17,"span"),l(18," 1 "),e()(),i(19,"div",7)(20,"div")(21,"span"),l(22," 1 "),e()(),i(23,"div")(24,"span"),l(25," 2 "),e()()()()()(),i(26,"div",9)(27,"div",4)(28,"ul",10)(29,"li",11)(30,"a",12),l(31),o(32,"translate"),e()()()()()()(),i(33,"div",13)(34,"form",14),y("ngSubmit",function(){return r.onSubmit()}),i(35,"div",15)(36,"div",16)(37,"label",17),l(38),o(39,"translate"),e(),s(40,"input",18),v(41,k,2,1,"div",19),e(),i(42,"div",16)(43,"label",20),l(44),o(45,"translate"),e(),s(46,"input",21),v(47,H,2,1,"div",22),e()(),i(48,"div",23)(49,"label",24),l(50),o(51,"translate"),e(),s(52,"input",25),e(),i(53,"div",23)(54,"label",26),l(55),o(56,"translate"),e(),s(57,"input",27),e(),i(58,"div",28)(59,"button",29),l(60),o(61,"translate"),e()()()()()()),b&2){let p,f;t(12),N(" ",r.firtsName," "),t(3),N(" ",r.firtsName," "),t(16),u(m(32,13,"profile.password")),t(3),S("formGroup",r.registerForm),t(4),u(m(39,15,"sign-in.first-name")),t(3),g((p=r.registerForm.get("firstName"))!=null&&p.invalid&&((p=r.registerForm.get("firstName"))!=null&&p.dirty||(p=r.registerForm.get("firstName"))!=null&&p.touched)?41:-1),t(3),u(m(45,17,"sign-in.last-name")),t(3),g((f=r.registerForm.get("lastName"))!=null&&f.invalid&&((f=r.registerForm.get("lastName"))!=null&&f.dirty||(f=r.registerForm.get("lastName"))!=null&&f.touched)?47:-1),t(3),u(m(51,19,"sign-in.email")),t(2),F("value",r.email),t(3),u(m(56,21,"profile.phone")),t(4),S("disabled",!r.registerForm.valid),t(),u(m(61,23,"config.save"))}},dependencies:[V,M,q,G,P,R,L,B,I,w,T]});let n=a;return n})();export{X as default};
