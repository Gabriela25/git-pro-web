import{a as D,b as m}from"./chunk-KIO5D7QW.js";import{c as v,d as b,e as x,f as E,g as w,h as T,j as F,k,m as c,n as u}from"./chunk-B27WB5BD.js";import{Ma as n,Na as o,Oa as r,T as l,Va as g,Wa as y,Xa as S,Y as f,Ya as a,ab as p}from"./chunk-SRNS2TCH.js";import"./chunk-KFZQC3P5.js";var A=(()=>{let e=class e{constructor(){this.maps_key=D.MAPS_KEY,this.options={mapId:"DEMO_MAP_ID",center:{lat:-31,lng:147},zoom:4}}};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=l({type:e,selectors:[["app-home"]],viewQuery:function(i,d){if(i&1&&g(m,5),i&2){let M;y(M=S())&&(d.sidebar=M.first)}},standalone:!0,features:[p],decls:25,vars:0,consts:[[1,"container-fluid","ml-3","mr-3"],[1,"row"],[1,"col-md-1"],[1,"col-md-10","p-5"],[1,"container","text-center"],[1,"row","pt-5"],[1,"col-md-2","text-center","bg-white","p-4","rounded","shadow","m-2"],["href","http://"],["src","assets/electrical.jpg","alt","","width","120","height","180"],["src","assets/plumbing.jpg","alt","","width","120","height","180"],[1,"col-md-2"]],template:function(i,d){i&1&&(r(0,"app-header"),n(1,"div",0)(2,"div",1),r(3,"div",2),n(4,"div",3)(5,"div",4)(6,"h1")(7,"b"),a(8,"Find the best professionals who will satisfy all your needs"),o()()(),n(9,"div",5)(10,"div",6)(11,"a",7),r(12,"img",8),o()(),n(13,"div",6)(14,"a",7),r(15,"img",9),o()(),n(16,"div",10),a(17,"3"),o(),n(18,"div",10),a(19,"4"),o(),n(20,"div",10),a(21,"5"),o(),n(22,"div",10),a(23,"6"),o()()(),r(24,"div",2),o()())},dependencies:[u]});let t=e;return t})();var _=(()=>{let e=class e{};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=l({type:e,selectors:[["app-form"]],standalone:!0,features:[p],decls:13,vars:0,consts:[["autocomplete","off"],[1,"mb-3"],["for","service",1,"form-label","fw-bold"],["aria-label","Default select example","id","service",1,"form-select"],["selected",""],["value","1"],["value","2"],["value","3"]],template:function(i,d){i&1&&(n(0,"form",0)(1,"div",1)(2,"label",2),a(3,"Service"),o(),n(4,"select",3),r(5,"option",4),n(6,"option",5),a(7,"One"),o(),n(8,"option",6),a(9,"Two"),o(),n(10,"option",7),a(11,"Three"),o()()(),r(12,"div",1),o())},dependencies:[c]});let t=e;return t})();var B=(()=>{let e=class e{};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=l({type:e,selectors:[["app-service"]],standalone:!0,features:[p],decls:8,vars:0,consts:[[1,"container-fluid"],[1,"row"],[1,"col-md-2"],[1,"col-md-10"],[1,"p-5"]],template:function(i,d){i&1&&(r(0,"app-header"),n(1,"div",0)(2,"div",1)(3,"div",2),r(4,"app-sidebar"),o(),n(5,"div",3)(6,"div",4),r(7,"app-form"),o()()()())},dependencies:[u,m,_]});let t=e;return t})();var R=[{path:"home",component:A},{path:"sidebar",component:m},{path:"sign-in",loadChildren:()=>import("./chunk-4PUIZ2T2.js")},{path:"customer/profile",loadChildren:()=>import("./chunk-NE4SD4U2.js")},{path:"pro/profile",loadChildren:()=>import("./chunk-XOXQBKQZ.js")},{path:"pro/service",component:B},{path:"list",loadChildren:()=>import("./chunk-2HY2MXTR.js")},{path:"",redirectTo:"home",pathMatch:"full"},{path:"**",redirectTo:"home",pathMatch:"full"}];var h=class{http;prefix;suffix;constructor(e,Q="/assets/i18n/",s=".json"){this.http=e,this.prefix=Q,this.suffix=s}getTranslation(e){return this.http.get(`${this.prefix}${e}${this.suffix}`)}};function H(t){return new h(t,"assets/i18n/",".json")}var I={providers:[F(R),w(),b(x()),f(v),f(c.forRoot({defaultLanguage:"en",loader:{provide:k,useFactory:H,deps:[v]}}))]};var z=(()=>{let e=class e{constructor(){this.title="git-pro-web"}};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=l({type:e,selectors:[["app-root"]],standalone:!0,features:[p],decls:1,vars:0,template:function(i,d){i&1&&r(0,"router-outlet")},dependencies:[T]});let t=e;return t})();E(z,I).catch(t=>console.error(t));
