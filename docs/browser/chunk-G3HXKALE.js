import{a as S,c as j,e as E,g as z}from"./chunk-K54PWPRL.js";import{e as M}from"./chunk-4BZCEQMM.js";import{Da as k,Fa as l,Ha as b,L as a,La as p,Ma as m,Na as C,Oa as x,Q as h,Ra as I,Sa as d,T as f,Wa as P,Xa as A,Ya as _,ba as v,ca as y,cb as D,g as u,ra as s,sa as c,wa as w}from"./chunk-DDNSS5IW.js";var F=(()=>{let t=class t{constructor(){this.triggerDirection=new u(null),this.currentData=this.triggerDirection.asObservable()}changeData(i){this.triggerDirection.next(i)}};t.\u0275fac=function(e){return new(e||t)},t.\u0275prov=a({token:t,factory:t.\u0275fac,providedIn:"root"});let n=t;return n})();var L=(()=>{let t=class t{constructor(i){this.http=i,this.apiKey=S.MAPS_KEY,this.apiUrl=`https://maps.googleapis.com/maps/api/geocode/json?key=${this.apiKey}`}getAddressSev(i,e){let o=`${this.apiUrl}&latlng=${i},${e}`;return console.log(o),this.http.get(o)}};t.\u0275fac=function(e){return new(e||t)(h(M))},t.\u0275prov=a({token:t,factory:t.\u0275fac,providedIn:"root"});let n=t;return n})();var Q=["searchInput"];function $(n,t){if(n&1){let r=x();p(0,"map-marker",5),I("mapDragend",function(e){v(r);let o=d();return y(o.updatePosition(e))}),m()}if(n&2){let r=d();l("position",r.markerPosition)("options",r.markerOptions)}}var N=(()=>{let t=class t{constructor(i,e,o){this.ngZone=i,this.geocodingService=e,this.comunication=o,this.direccion="",this.center={lat:32.774961057402194,lng:-96.80725954388643},this.zoom=12,this.markerPosition=this.center,this.markerOptions={draggable:!0}}ngOnInit(){}ngAfterViewInit(){this.isBrowser()&&(window.google?this.initializeAutocomplete():window.addEventListener("load",()=>this.initializeAutocomplete()))}isBrowser(){return typeof window<"u"}initializeAutocomplete(){let i=new google.maps.places.Autocomplete(this.searchElementRef.nativeElement,{types:["address"]});i.addListener("place_changed",()=>{this.ngZone.run(()=>{let e=i.getPlace();e.geometry===void 0||e.geometry===null||(this.center={lat:e.geometry.location.lat(),lng:e.geometry.location.lng()},this.markerPosition=this.center,console.log("Selected place:",e),console.log("Coordinates:",this.center))})})}updatePosition(i){i.latLng!=null&&(this.markerPosition={lat:i.latLng.lat(),lng:i.latLng.lng()},console.log(i),console.log("Marker moved to:",this.markerPosition),this.getAddress(this.markerPosition.lat,this.markerPosition.lng))}getAddress(i,e){this.geocodingService.getAddressSev(i,e).subscribe(o=>{o.status==="OK"?(this.direccion=o.results[0].formatted_address,this.comunication.changeData(this.direccion)):this.direccion="No se encontr\xF3 la direcci\xF3n"},o=>{console.error("Error al obtener la direcci\xF3n:",o),this.direccion="Error al obtener la direcci\xF3n"})}};t.\u0275fac=function(e){return new(e||t)(c(w),c(L),c(F))},t.\u0275cmp=f({type:t,selectors:[["app-autocomplete"]],viewQuery:function(e,o){if(e&1&&P(Q,5),e&2){let g;A(g=_())&&(o.searchElementRef=g.first)}},standalone:!0,features:[D],decls:5,vars:4,consts:[["searchInput",""],[1,"map-container"],["type","text","placeholder","Ingresa una ubicaci\xF3n",3,"value"],["height","400px","width","100%",3,"center","zoom"],[3,"position","options"],[3,"mapDragend","position","options"]],template:function(e,o){e&1&&(p(0,"div",1),C(1,"input",2,0),p(3,"google-map",3),k(4,$,1,2,"map-marker",4),m()()),e&2&&(s(),l("value",o.direccion),s(2),l("center",o.center)("zoom",o.zoom),s(),b(o.markerPosition?4:-1))},dependencies:[z,j,E],styles:[".map-container[_ngcontent-%COMP%]{position:relative}input[_ngcontent-%COMP%]{width:100%;padding:8px;box-sizing:border-box;margin-bottom:10px}"]});let n=t;return n})();export{F as a,N as b};
