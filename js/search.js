var suggest_count = 0;
var input_initial_value = '';
var suggest_selected = 0;
var script_path = window._path_common_project+"/search/search.php";
var id_form = ".SEARCH";
var id_container = ".SEARCH-RESULT";
var id_serch_form = "#search_box";
var id_serch_form_type = "#type_box";
var var_delay = 1000; // задержка перед запросом после зажатия клавишь
var timer;

var main_number = 2; // с какого символа начинаем искать?
var counter_ = 0; // для теста

$(window).load(function(){
	

/*
	$('.SEARCH input, .SEARCH select').click(function(){
		$(id_form).addClass("opacity100");
		$('.hide-layout-2').fadeIn(300);		
	});
*/
	$('.SEARCH select').change(function(){
		$(id_container).hide().html('');
		// $(id_form).addClass("opacity100");
		// alert("!!!");
	});

	$('.SEARCH .ico-search').click(function(){
		$(id_form).addClass("opacity100");
		$('.SEARCH input').focus();	
		$('.hide-layout-2').fadeIn(300);
		
		if($(id_serch_form).val())
		// если что-то введено
			{
				ajax_query();	
			}
	});
/*	
	$('.hide-layout-2').click(function(){
		$(this).fadeOut(200);
	});
*/	
	
	


/*	
	$('.hide-layout').click(function(){
		$(".SEARCH").removeClass("z1000");
	});
*/
	
	
	// читаем ввод с клавиатуры
	$(id_serch_form).keyup(function(I){
		// определяем какие действия нужно делать при нажатии на клавиатуру
		
	
		
		
		switch(I.keyCode) {
			// игнорируем нажатия на эти клавишы
			case 13:  // enter
			case 27:  // escape
			case 38:  // стрелка вверх
			case 40:  // стрелка вниз
			case 32: // пробел
			case 37:  // стрелка влево
			case 39: // стрелка вправо
			case 16: // shift
			case 9: // tab
			case 18: // alt
			case 17: // ctrl
			case 20: // capslock
			break;

			default:
				// производим поиск только при вводе более 2х символов
				if($(id_serch_form).val().length>main_number){
					
				   ajax_query();
					
				}
				
				
			break;
		}
	});

	//считываем нажатие клавишь, уже после вывода подсказки
	$(id_serch_form).keydown(function(I){
		switch(I.keyCode) {
			// по нажатию клавишь прячем подсказку
			case 13: // enter
				{
					// открываем ссылку
					//alert("!!!");	
					// log.console();
					
					// $("#iddd").html($("#search_advice_wrapper div.active a").attr("href"));
					if($(id_container +" li.active a").length > 0){
							window.location.href = $(id_container +" li.active a").attr("href");
						}
					
					return false;
					break;
					
				}
			case 27: // escape
				$(id_container).hide();
				return false;
			break;
			// делаем переход по подсказке стрелочками клавиатуры
			case 38: // стрелка вверх
			case 40: // стрелка вниз
				I.preventDefault();
				if(suggest_count){
					//делаем выделение пунктов в слое, переход по стрелочкам
					key_activate( I.keyCode-39 );
				}
			break;
		}
	});

	// делаем обработку клика по подсказке
	$(id_container + " li a").click(function(){
		// ставим текст в input поиска
		$(id_serch_form).val($(this).text());
		// прячем слой подсказки
		$(id_container).fadeOut(350).html('');
	});

	// если кликаем в любом месте сайта, нужно спрятать подсказку
	$('html').click(function(e){
		if (!$(id_serch_form_type).is(e.target) 
		&& !$(id_serch_form_type+ " option").is(e.target)
		&& !$(id_form + " .ico-search").is(e.target)
		)
		// исключаем клик по селекту и иконке
			{
				$(id_container).hide();
				$(id_form).removeClass("opacity100");		
				$('.hide-layout-2').fadeOut(300);
			}
	});
	
	// если кликаем на поле input и есть пункты подсказки, то показываем скрытый слой
	$(id_serch_form).click(function(event){
		//alert(suggest_count);
		if(suggest_count)
			$(id_container).show();
		event.stopPropagation();
	});
	
	
	
	
});



function key_activate(n){
	$(id_container+' li').eq(suggest_selected-1).removeClass('active');

	if(n == 1 && suggest_selected < suggest_count){
		suggest_selected++;
	}else if(n == -1 && suggest_selected > 0){
		suggest_selected--;
	}

	if( suggest_selected > 0){
		$(id_container+' li').eq(suggest_selected-1).addClass('active');
		
		$(id_serch_form).val( $(id_container+' li').eq(suggest_selected-1).text() );
	} else {
		$(id_serch_form).val( input_initial_value );
	}
}



function ajax_query(){
// поиск	
$(id_form+' .ico-search').addClass("spinner");				  
				   
	 window.clearTimeout(timer);
	 timer = setTimeout(function(){
	  
			input_initial_value = $(id_serch_form).val();
			var msg = $(id_form+" form").serialize();
			
			// производим AJAX запрос к /ajax/ajax.php, передаем ему GET query, в который мы помещаем наш запрос
			$.post(script_path, msg,function(data){
				// "query":$(this).val()
				
				//php скрипт возвращает нам строку, ее надо распарсить в массив.
				
				// перед показом слоя подсказки, его обнуляем
				$(id_container).html(data).show();
					
				suggest_count = $(id_container+" ul li").length;
				// alert(suggest_count);
				
				// для теста интерсивности запросов к базе 
				counter_++;
				$("div.test").html(counter_);

				$(id_form+' .ico-search').removeClass("spinner");
				
			}, 'html');
	  
	  
		   // тут ajax запрос
	   }, var_delay);	
}