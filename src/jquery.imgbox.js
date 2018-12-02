/**
 * jQuery imgbox 插件
 * @author niqingyang
 * @version 1.0
 * @site:https://acme.top/
 * @github https://github.com/acme-top/jquery.imgbox.js
 * @date 2018-12-02
 */
!function($) {
	
	var defaults = {
		// 是否支持缩放
		zoom: true,
		// 是否支持拖曳
		drag: true,
		// 图片放大后的最大比例，默认是原图展示，此值不会超过矿口的宽度
		scale: 1,
	};
	
	$.fn.imgbox = function(options){
		
		options = $.extend({}, defaults, options);
		
		$(this).css({
			cursor: "zoom-in"
		}).parents("a").attr("href", "javascript:void(0);").click(function(){
			return false;
		}).css({
			cursor: "default",
		});
		
		$(this).click(function(){
			
			var src = $(this).attr("src");
			
			var viewbtn = $('<a target="_blank" class="check-original-image" href="' + src + '">查看原图</a>');
			
			var mask = $('<div data-pop-layer="1" style=""></div>').css({
				position: "fixed",
				left: "0px",
				right: "0px",
				top: "0px",
				bottom: "0px",
				height: "100%",
				width: "100%",
				zIndex: "9999999",
				backgroundColor: "rgba(26,26,26,.65)",
				opacity: 0.8,
				userSelect: "none"
			});
			
			var image = $('<img src="' + $(this).attr("src") + '" >').css({
				position: "fixed",
				top: "0px",
				zIndex: "10000000",
				display: "none"
			});
			
			var width = $(image).prop("width");
			var height = $(image).prop("height");
			
			var scale = width / height;
			
			$("body").append(viewbtn).append(mask).append(image).css({
				overflow: "hidden"
			});
			
			$(image).fadeIn("fast");
			
			$(viewbtn).click(function(){
				event.stopPropagation();
			});
			
			var resize_handler  = function(){
				
				var w = width;
				var h = height;
				
				var max_width = $(window).width() - 5;
				var max_height = $(window).height();
				
				w = w * options.scale < max_width ? w * options.scale : max_width;
				h = w / scale;
				
				if(h > max_height){
					h = max_height;
					w = h * scale;
				}
				
				$(image).width(w);
				$(image).height(h);
				
				$(image).css({
					left: ($(window).width() - w) / 2 + "px",
					top: ($(window).height() - h) / 2 + "px",
				});
			};
			
			var close_handler = function(){
				
				$(window).off("resize", resize_handler).off("mousewheel", scale_handler).off("DOMMouseScroll", scale_handler);
				
				$(image).fadeOut("fast", function(){
					$(this).remove();
				});
				
				$("body").css({
					overflow: "auto"
				});
				
				$(viewbtn).remove();
				$(mask).remove();
				
				if(options.drag){
					$(this).remove();
				}else{
					$(window).off("click", close_handler);
				}
				
				return false;
			};
			
			var scale_handler = function(e, delta) {
				
				var scale = $(image).data("scale");
				
				if(!scale){
					scale = 1;
				}
				
				if(e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0){
					// 向上滚动
					scale += 0.1;
				}else{
					// 向下滚动
					scale -= 0.1;
					
					if(scale <= 0.01){
						return;
					}
				}
				
				$(image).css({
					transform: "scale("+scale+")"
				}).data("scale", scale);
				
				return false;
			};
			
			// 拖曳图片
			if(options.drag){
				
				var closebtn = $('<a class="close-original-image material-icons" href="javascript:void(0);"></a>');
				
				$("body").append(closebtn);
				
				// 鼠标样式
				$(image).css({
					cursor: "move",
				});
				
				function drag(obj) {
			        $(obj).mousedown(function(ev) {
			            var ev = ev || event;
			            
			            var disX = ev.clientX - this.offsetLeft;
			            var disY = ev.clientY - this.offsetTop;
			            
			            if (obj.setCapture) {
			                obj.setCapture();
			            }
			            
			            var mousemove = function(ev) {
			                var ev = ev || event;
			                
			                obj.style.left = ev.clientX - disX + 'px';
			                obj.style.top = ev.clientY - disY + 'px';
			            };
			            
			            var mouseup = function() {
			            	
			            	$(document).off("mousemove", mousemove).off("mouseup", mouseup);
			            	
			                // 释放全局捕获 releaseCapture();
			                if (obj.releaseCapture) {
			                    obj.releaseCapture();
			                }
			            };
			            
			            $(document).on("mousemove", mousemove);
			            
			            $(document).on("mouseup", mouseup);
			            
			            return false;
			            
			        });
			        
			    }
				
				drag(image.get(0));
				
				// 关闭按钮点击事件
				$(closebtn).click(close_handler);
			}else{
				// 鼠标样式
				$(image).css({
					cursor: "zoom-out",
				});
				// 点击窗口关闭
				$(window).click(close_handler);
			}
			
			// 窗口改变事件
			$(window).on("resize", resize_handler).trigger("resize");
			
			// 缩放图片
			if(options.zoom){
				$(window).on("mousewheel DOMMouseScroll", scale_handler);
			}
		});
	};
	
}(jQuery);