import './polyfills.server.mjs';
import{a as J,b as u,c as U,d as X,f as Z,g as ee}from"./chunk-VQGQJAUM.mjs";import{c as K}from"./chunk-KXSHKXAS.mjs";import{a as N,c as v,d as C}from"./chunk-INVBEQWN.mjs";import{A as Y,f as q,g as P,m as T,o as G,p as $,u as j,v as W,w as V}from"./chunk-ZTGX73TJ.mjs";import{$a as B,Eb as O,Ka as f,Na as w,Oa as A,Pa as _,Qa as o,Ra as n,Sa as a,U as p,Wa as b,Z as y,ab as R,bb as I,db as c,eb as S,fb as z,hb as l,ib as x,jb as Q,kb as H,mb as L,wa as d}from"./chunk-4Q4GCXRX.mjs";import{h as k}from"./chunk-NDYDZJSS.mjs";var te=(()=>{let e=class e{constructor(){this.title="git-pro-web"}};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=p({type:e,selectors:[["app-root"]],standalone:!0,features:[l],decls:1,vars:0,template:function(i,s){i&1&&a(0,"router-outlet")},dependencies:[V]});let t=e;return t})();var de=()=>({fillColor:"red",fillOpacity:.2,strokeWeight:0}),ue=()=>({fillColor:"blue",fillOpacity:.2,strokeWeight:0}),fe=(t,e)=>({lat:t,lng:e});function he(t,e){if(t&1&&a(0,"map-advanced-marker",3,0),t&2){let h=e.$implicit;f("position",Q(1,fe,h.lat,h.lng))}}var ie=(()=>{let e=class e{constructor(){this.resultb="",this.resultc="",this.pointA={lat:-.180653,lng:-78.467834},this.pointB={lat:-2.170998,lng:-79.922359},this.pointC={lat:-2.90055,lng:-79.00453},this.radiusB=3e5,this.radiusC=1e5,this.radiusCMiles=this.convertMetersToMiles(this.radiusC),this.options={mapId:"DEMO_MAP_ID",center:this.pointA,zoom:7,zoomControl:!0},this.nzLocations=[this.pointA,this.pointB,this.pointC],this.circleCenterB=this.pointB,this.circleCenterC=this.pointC,this.distanceB=this.haversineDistance(this.pointA,this.pointB),this.distanceC=this.haversineDistance(this.pointA,this.pointC)}ngOnInit(){this.calculate()}convertMetersToMiles(r){return r/1609.34}haversineDistance(r,i){let m=ce=>ce*Math.PI/180,F=m(i.lat-r.lat),D=m(i.lng-r.lng),le=m(r.lat),me=m(i.lat),E=Math.sin(F/2)*Math.sin(F/2)+Math.sin(D/2)*Math.sin(D/2)*Math.cos(le)*Math.cos(me);return 6371e3*(2*Math.atan2(Math.sqrt(E),Math.sqrt(1-E)))}calculate(){this.distanceB<=this.radiusB?(this.resultb="Quito est\xE1 dentro de los 300km de Guayaquil",console.log("B est\xE1 dentro del radio de 300km de A</br>")):this.resultb="Quito est\xE1 fuera de los 300km de Guayaquil",this.distanceC<=this.radiusC?this.resultc+="Quito est\xE1 dentro de los "+this.radiusC.toFixed(2)+" de Cuenca":this.resultc+="Quito fuera de los "+this.radiusC.toFixed(2)+" de Cuenca"}calculateRadiusMinus(){this.resultc="",this.radiusC-=this.radiusC*.15,this.radiusCMiles=this.convertMetersToMiles(this.radiusC),this.calculate(),this.options={center:this.pointC,zoom:this.options.zoom+1}}calculateRadiusAdd(){return k(this,null,function*(){this.resultc="",this.radiusC+=this.radiusC*.15,this.radiusCMiles=this.convertMetersToMiles(this.radiusC),this.calculate(),this.options={center:this.pointC,zoom:this.options.zoom-1}})}};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=p({type:e,selectors:[["app-maps"]],standalone:!0,features:[l],decls:21,vars:15,consts:[["markerElem","mapAdvancedMarker"],["height","1000px"],["height","800px","width","1000px",3,"options"],[3,"position"],[3,"center","radius","options"],[1,"d-flex","justify-content-center","mt-3"],["type","button",3,"click"],[1,"bi","bi-dash-circle-fill"],[1,"bi","bi-plus-square-fill"]],template:function(i,s){i&1&&(o(0,"div",1)(1,"google-map",2),A(2,he,2,4,"map-advanced-marker",3,w),a(4,"map-circle",4)(5,"map-circle",4),n(),o(6,"div",5)(7,"button",6),b("click",function(){return s.calculateRadiusMinus()}),o(8,"span"),a(9,"i",7),n()(),o(10,"span"),c(11),H(12,"number"),n(),o(13,"button",6),b("click",function(){return s.calculateRadiusAdd()}),o(14,"span"),a(15,"i",8),n()()(),o(16,"div")(17,"p"),c(18),n(),o(19,"p"),c(20),n()()()),i&2&&(d(),f("options",s.options),d(),_(s.nzLocations),d(2),f("center",s.circleCenterB)("radius",s.radiusB)("options",x(13,de)),d(),f("center",s.circleCenterC)("radius",s.radiusC)("options",x(14,ue)),d(6),z(" ",L(12,10,s.radiusCMiles,"1.2-2")," Miles"),d(7),S(s.resultb),d(2),S(s.resultc))},dependencies:[ee,U,X,Z,P,q]});let t=e;return t})();var oe=(()=>{let e=class e{constructor(){this.maps_key=J.MAPS_KEY,this.options={mapId:"DEMO_MAP_ID",center:{lat:-31,lng:147},zoom:4}}};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=p({type:e,selectors:[["app-home"]],viewQuery:function(i,s){if(i&1&&B(u,5),i&2){let m;R(m=I())&&(s.sidebar=m.first)}},standalone:!0,features:[l],decls:7,vars:0,consts:[[1,"container-fluid"],[1,"row"],[1,"col-md-2"],[1,"col-md-10"]],template:function(i,s){i&1&&(a(0,"app-header"),o(1,"div",0)(2,"div",1)(3,"div",2),a(4,"app-sidebar"),n(),o(5,"div",3),a(6,"app-maps"),n()()())},dependencies:[C,u,ie]});let t=e;return t})();var ne=(()=>{let e=class e{};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=p({type:e,selectors:[["app-form"]],standalone:!0,features:[l],decls:13,vars:0,consts:[["autocomplete","off"],[1,"mb-3"],["for","service",1,"form-label","fw-bold"],["aria-label","Default select example","id","service",1,"form-select"],["selected",""],["value","1"],["value","2"],["value","3"]],template:function(i,s){i&1&&(o(0,"form",0)(1,"div",1)(2,"label",2),c(3,"Service"),n(),o(4,"select",3),a(5,"option",4),o(6,"option",5),c(7,"One"),n(),o(8,"option",6),c(9,"Two"),n(),o(10,"option",7),c(11,"Three"),n()()(),a(12,"div",1),n())},dependencies:[v]});let t=e;return t})();var re=(()=>{let e=class e{};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=p({type:e,selectors:[["app-service"]],standalone:!0,features:[l],decls:8,vars:0,consts:[[1,"container-fluid"],[1,"row"],[1,"col-md-2"],[1,"col-md-10"],[1,"p-5"]],template:function(i,s){i&1&&(a(0,"app-header"),o(1,"div",0)(2,"div",1)(3,"div",2),a(4,"app-sidebar"),n(),o(5,"div",3)(6,"div",4),a(7,"app-form"),n()()()())},dependencies:[C,u,ne]});let t=e;return t})();var se=[{path:"home",component:oe},{path:"sidebar",component:u},{path:"sign-in",loadChildren:()=>import("./chunk-BPNVZOWX.mjs")},{path:"customer/profile",loadChildren:()=>import("./chunk-SU3BM37I.mjs")},{path:"pro/profile",loadChildren:()=>import("./chunk-63M2SG4D.mjs")},{path:"pro/service",component:re},{path:"",redirectTo:"home",pathMatch:"full"},{path:"**",redirectTo:"home",pathMatch:"full"}];var g=class{http;prefix;suffix;constructor(e,h="/assets/i18n/",r=".json"){this.http=e,this.prefix=h,this.suffix=r}getTranslation(e){return this.http.get(`${this.prefix}${e}${this.suffix}`)}};function ve(t){return new g(t,"assets/i18n/",".json")}var ae={providers:[Y(se),W(),G($()),y(T),y(v.forRoot({defaultLanguage:"es",loader:{provide:N,useFactory:ve,deps:[T]}}))]};var Ce={providers:[K()]},pe=O(ae,Ce);var Me=()=>j(te,pe),rt=Me;export{rt as a};
