/* $Id: compare.js 15469 2008-12-19 06:34:44Z testyang $ */
var Compare = new Object();
Compare = {
  add : function(goodsId, goodsName, type, goodsImg, price){
    var count = 0;
    for (var k in this.data){
      if (typeof(this.data[k]) == "function")
      continue;
      if (this.data[k].t != type) {
		  $('.pop-compare,.pop-mask').show();
		  $('.pop-compare .pop-text').html(goods_type_different.replace("%s", goodsName));
		  $('.pop-compare').css({'top':($(window).height()-$('.pop-compare').outerHeight())/2});
		  $('.pop-compare .pop-text').css({'padding-top':''});	
        return;
      }
      count++;
    }
	
    if (this.data[goodsId]){
      this.remove(goodsId);
      return;
    }
    else{
      this.data[goodsId] = {n:goodsName,t:type,img:goodsImg,p:price};
	  $('.compare-btn').each(function(index, element) {
		  if($(this).attr('data-goods') == goodsId)
			  $(this).addClass('curr');
	  });
    }
	if(count>=4){
		$('.pop-compare,.pop-mask').show();
		$('.pop-compare .pop-text').html('对比商品已有4个，请删除再行添加');
		$('.pop-compare').css({'top':($(window).height()-$('.pop-compare').outerHeight())/2});		
		$('.pop-compare .pop-text').css({'padding-top':'20px'});
		return;
	}
	if($('#compareBox').css('display') == 'none'){
		$('#compareBox').css('display', 'block');
	}
    this.save();
    this.init();
  },
  init : function(){
    this.data = new Object();
    var cookieValue = document.getCookie("compareItems");
    if (cookieValue != null) {
      eval("this.data = " + cookieValue);
    }
	
    this.compareBox = document.getElementById(this.compareBoxId);
    this.compareList = document.getElementById(this.compareListId);
    this.compareList.id = "compareList";	
	
	
    this.compareList.innerHTML = "";
    var self = this;
	var count = 0;
    for (var key in this.data){
      if(typeof(this.data[key]) == "function")
        continue;
	  var img = document.createElement('IMG');
	  var aimg = document.createElement('A');
      var dl = document.createElement("DL");
      var span = document.createElement("SPAN");
	  var a = document.createElement('A');
	  var dt = document.createElement('DT');
	  var dd = document.createElement('DD');
	  var span = document.createElement('SPAN');
	  var strong = document.createElement('STRONG');
	  img.src = this.data[key].img;
	  aimg.href = 'http://39.108.6.181/0rongkey/js/goods.php?id='+key;
	  aimg.appendChild(img);
      span.className = "main-color";
      a.innerHTML = this.data[key].n;
	  a.className = 'name';
	  a.href = 'http://39.108.6.181/0rongkey/js/goods.php?id='+key;
	  span.appendChild(a);
	  dt.appendChild(aimg);
	  dd.appendChild(a);
	  dl.appendChild(dt);
      dl.appendChild(dd);
	  strong.innerHTML = this.data[key].p;
      var delBtn = document.createElement("A");
      delBtn.innerHTML = "删除";
      delBtn.className = key;
      delBtn.onclick = function(){
         self.remove(this.className);
      }

	  dl.onmousemove = function (){
		  this.childNodes[1].childNodes[1].childNodes[1].style.visibility = 'visible';
	  };
	  dl.onmouseout = function (){
	  	this.childNodes[1].childNodes[1].childNodes[1].style.visibility = 'hidden';
	  };
	  span.appendChild(strong);
	  span.appendChild(delBtn);
      dd.appendChild(span);
      this.compareList.appendChild(dl);
	  count++;
    }
	while(count<4){
	  var dl = document.createElement("DL");
	  var dt = document.createElement('DT');
	  var dd = document.createElement('DD');
	  dt.style.backgroundColor = '#F6F6F6';
	  dt.innerHTML = count+1;
	  dd.innerHTML = '您还可以继续添加';
	  dl.appendChild(dt);
      dl.appendChild(dd);
      
      this.compareList.appendChild(dl);
	  count++;
	}
	var operate = document.createElement('DIV');
	var comp = document.createElement('A');
	var clr = document.createElement('A');
	//'<div class="diff-operate"><a class="btn-compare-b compare-active" href="#none" id="goto-contrast" target="_blank">对比</a><a class="del-items">清空对比栏</a></div>';
	comp.innerHTML = '对比';
	comp.className = 'compare';
	comp.onclick = function() {
        var cookieValue = document.getCookie("compareItems");
        var obj = JSON.parse(cookieValue);
        var url = document.location.href;
        url = url.substring(0,url.lastIndexOf('/')+1) + "compare.php";
        var i = 0;
        for(var k in obj){
          if(typeof(obj[k])=="function")
          continue;
          if(i==0)
            url += "?goods[]=" + k;
          else
            url += "&goods[]=" + k;
          i++;
        }
        if(i<2){
			$('.pop-compare,.pop-mask').show();
			$('.pop-compare .pop-text').html(compare_no_goods);
			$('.pop-compare').css({'top':($(window).height()-$('.pop-compare').outerHeight())/2});	
          return ;
        }
        document.location.href = url;
      }
	clr.innerHTML = '清空对比栏';
	clr.className = 'clear';
	clr.onclick = function(){
		Compare.clear();
	};
	operate.className = 'operate';
	operate.appendChild(comp);
	operate.appendChild(clr);
	compareList.appendChild(operate);
	
  },
  save : function(){
    var date = new Date();
    date.setTime(date.getTime() + 99999999);
    document.setCookie("compareItems", JSON.stringify(this.data));
  },
  clear : function(){
	  for(var k in this.data){
	  	delete this.data[k];
	  }
	  $('.compare-btn').each(function(index, element) {
			$(this).removeClass('curr');
		});
	  this.save();
      this.init();
  },
  remove : function(id){
  		delete this.data[id];
		$('.compare-btn').each(function(index, element) {
			if($(this).attr('data-goods') == id)
				$(this).removeClass('curr');
		});
		if($('#compareBox').css('display') == 'none'){
			$('#compareBox').css('display', 'block');
		}
        this.save();
        this.init();
  },
  show : 1,
  compareBoxId : 'compareBox',
  compareListId : 'compareList'
}