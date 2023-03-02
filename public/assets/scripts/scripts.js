$(document).ready (function() {
    resizeWindow();

    // NAV PRE LOGIN - load
    $('.pre-logged-in #nav-side').load('nav-pre-login.html');

    // NAV POST LOGIN - load
    $('.post-logged-in #nav-side').load('nav-post-login.html');

    // HEADER - load
    $('#header').load('header.html');

    // MAIN PRE LOGIN - load
    loadMainPage();

    // FOOTER MAIN - load
    $('#footer-main').load('footer-main.html');

    // FOOTER CTAs - load
    $('.pre-logged-in #footer-ctas').addClass('flex-col align-items-center mg-child-xxs').load("footer-ctas.html");

    // STICKY FOOTER - load
    $('.pre-logged-in #sticky-footer').addClass('pos-fix width-100percent');
    $('.pre-logged-in #sticky-footer > .grid').load("footer-ctas.html");
});

// Nav Side Open Close Status
function toggleNav() {
    var navStatus = document.getElementById("template");
    
    if(navStatus.classList.contains("mobile"))
        navStatus.classList.toggle("nav-opened");
    
    var navSide = $('.nav-side');
    navSide.addClass('tween');
    setTimeout(function () {
        navSide.removeClass('tween');
    }, 3000);

    var divWrap = $('.wrap');
    divWrap.addClass('tween');
    setTimeout(function () {
        divWrap.removeClass('tween');
    }, 2000);
}

// Open Modal
function openModal() {
    $('#template').addClass('modal-opened');
    $('.modal-loader').append($('<div class="modal-dialog">'));
    $('.modal-loader').append($('<div class="modal-overlay" onclick="closeModal()">'));
}

// Open Login
function openLogin() {
    openModal();
    $('.modal-dialog').load("login.html");
}

// Open Login - Login In Nav
function navWidthStatusLoginButton() {
    if ($('#template').hasClass('nav-opened')) {
        $('#template').removeClass('nav-opened');
        openLogin();
    } else {
        openLogin();
    }
}

// Close Modal
function closeModal() {
    $('#template').removeClass('modal-opened');
    var divLoader = document.querySelector('.modal-loader');
    divLoader.innerHTML = '';
}

// Hide and Show Sticky Footer
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    $('#sticky-footer').addClass('showUp').removeClass('hideDown');
  } else {
    $('#sticky-footer').addClass('hideDown').removeClass('showUp');
  }
  prevScrollpos = currentScrollPos;
}

function loadMainPage() {
    let elemClassName;
    let parentPage;
    let mainParentpage;
    let mainContentpage = 'main-content';
    let currTemplate = getCurrTemplate();

    /* 
    ** This function is used to retain the loaded page {triggered using loadPage()} 
    ** in main content when page is reloaded
    ** {Get the value of hash to get the page loaded in the main content}
    */
    let currAjaxPage = location.hash.substr(1);
        
    if(currAjaxPage){
        mainContentpage = currAjaxPage;
        $('#template').addClass('contentOpened-' + mainContentpage);
    }
    
    /* 
    ** This function is used to load the layer page in the main content
    ** {Get all class names in body and check if it contains classes that has a page- AND parent- prefix}
    ** page-{current page}
    ** parent-{parent page of layer}
    */
    
    let classNameList = document.querySelector("body").className.split(' ');
        
    $.each(classNameList, function (key, value) {
        if (value.indexOf("page") === 0) {
            elemClassName = value;
        }
        if (value.indexOf("parent") === 0) {
            parentPage = value;
        }
    });                 
    
    /* 
    ** Replace page- prefix with main-{current page name}
    ** {Note: Filename should be same with main-{current page name} to load the content inside #main-content (e.g main-hot-offers.html)}
    */
    if(elemClassName)
        mainContentpage = elemClassName.replace('page-','main-');
    
    // Get parent page and assign it to BACK page
    if(parentPage)
        mainParentpage = parentPage.replace('parent-','');

    $('#main-content').load(mainContentpage + '.html', function() {
        // Prepend main content header with < back to page link, page title, and home icon link
        if(elemClassName && parentPage){
            $('.layer-page #main-content').addClass('inner-content');
            let mainHeadertitle = $('.layer-page #main-content.inner-content > .max-content-width > .inner-title').text();
            let mainHeader = '<div class="main-header-wrapper flex-row justify-content-space-between align-items-center divider-bottom width-100percent pd-xs"><a href="./'+currTemplate+'.html#'+mainParentpage+'"><i class="font-icon icon-arrow-right-thick arr-left"></i></a><h5 class="header-logo pos-ab-hor-center-ver-center mg-none">'+mainHeadertitle+'</h5><a href="./'+currTemplate+'.html" class="header-home"><i class="font-icon icon-home"></a></div>';
            $('.layer-page #main-content.inner-content').prepend(mainHeader); 
            $('#template').addClass('layer-opened'); 
            $('nav .list-nav-col > li').removeClass('active');
            $('nav .list-nav-col > li > #' + mainParentpage).parent().addClass('active');
        }

        /*
        ** Add inner-content class so that #main-content will have a background
        ** Replace logo in header with page title
        */
        if(currAjaxPage){
            $('#main-content').addClass('inner-content');
            $('nav .list-nav-col > li').removeClass('active');
            $('nav .list-nav-col > li > #' + mainContentpage).parent().addClass('active');
            var navStatus = document.getElementById("template");
            let headerElem = document.querySelector('#header .header-logo');
            let headerLogoHtml = `<a href="#" id="header-logo" class="header-logo pos-ab-hor-center-ver-center"><h3 class="icon icon-large icon-brand"></h3></a>`;
            if(navStatus.classList.contains("mobile"))
            {
                let headerTitle = $('#main-content .inner-title').text();
                headerLogoHtml = `<h5 class="header-logo pos-ab-hor-center-ver-center mg-none">${headerTitle}</h5>`;
            }
            headerElem.outerHTML = headerLogoHtml;
        }
        // For Safari
        document.body.scrollTop = 0; 
        // For Chrome, Firefox, IE and Opera
        document.documentElement.scrollTop = 0; 
            
    });
}

function getCurrTemplate(){
    let currTemplate;
    let bodyElem = document.getElementById("template");
    let classNameList = document.querySelector("body").className.split(' ');

    $.each(classNameList, function (key, value) {
        if (value.indexOf("option") === 0) {
            currTemplate = value;
        }
    });  
    if(bodyElem.classList.contains("post-logged-in"))
        currTemplate = `${currTemplate}-logged-in`;

    return currTemplate;
}

function resizeWindow(){
    if ($(window).width() < 1379) {
        $('body').addClass('mobile');
    }
    else{
        $('body').removeClass('mobile');
    }  
    loadMainPage();
}

$(window).on('resize', resizeWindow);

function loadPage(obj) {
    let id = document.getElementById(obj.id);
    let page = id.getAttribute('data-page');
    let title = id.getAttribute('data-title');
    let currTemplate = getCurrTemplate();

    removeElClass('body','contentOpened','parent','page','layer');
    $('#template').addClass('contentOpened-' + obj.id);

    $(page).ready (function () {
        $('#main-content').load(page).addClass('inner-content');
        $('nav .list-nav-col > li').removeClass('active');
        $('nav .list-nav-col > li > #' + obj.id).parent().addClass('active');
    });

    if (history.pushState) {
        window.history.pushState(null,null,"./"+currTemplate+".html");
    } else {
        document.location.href = "./"+currTemplate+".html";
    }

    var navStatus = document.getElementById("template");
    if(navStatus.classList.contains("mobile"))
    {
        let headerTitle = document.querySelector('#header .header-logo');
        headerTitle.outerHTML = '<h5 class="header-logo pos-ab-hor-center-ver-center mg-none">'+title+'</h5>';
    }
    window.location.hash = obj.id;
    // For Safari
    document.body.scrollTop = 0; 
    // For Chrome, Firefox, IE and Opera
    document.documentElement.scrollTop = 0; 
    toggleNav();
}

function adjustContentHeight(){
    let divHeight = 0;
    if($('.toggle-menu > .modal').html().length === 0) {
        divHeight = 'auto';
    }else {
        divHeight = $('.toggle-menu > .modal > .modal-content-wrapper').height() + 50 + 'px';
    }
    $('#main-content.inner-content').css({'height' : divHeight});
}
function toggleOverlay(obj) {
    let id = $(obj).data('id');
    let url = $(obj).data('modal');

    $('.toggle-menu').find('[data-id='+id+']').addClass('active');
    $('.toggle-menu a').not('[data-id='+id+']').removeClass('active');
    $('#main-content > .content-wrapper').removeClass('close-overlay');
    $('.toggle-menu > .modal').load(url, function() {
        $(this).prepend('<div class="modal-header"><a onclick="toggleClose()"><i class="icon icon-small icon-chevronLeft"></i></a></div>'); 
        window.scrollTo(0, 0);
        adjustContentHeight();
    });
}
function toggleClose() {
    $('#main-content > .content-wrapper').addClass('close-overlay');
    $('#main-content > .content-wrapper .toggle-menu a').removeClass('active');
    $('.toggle-menu > .modal').html('');
    adjustContentHeight();
}
function readMore(obj) {
    let btn = document.getElementById(obj.id);
    let ellipses = document.getElementById(btn.getAttribute('data-id')).getElementsByClassName('ellipses')[0];
    let moreText = document.getElementById(btn.getAttribute('data-id')).getElementsByClassName('more-text')[0];
    
    if (ellipses.style.display === "none") {
        ellipses.style.display = "inline";
        btn.innerHTML = "Read More";
        moreText.style.display = "none";
    } else {
        ellipses.style.display = "none";
        btn.innerHTML = "Read Less";
        moreText.style.display = "inline";
    }
    adjustContentHeight();
}

let removeElClass = (selector, ...string) => {
    Array.from(string).forEach((el, x) => {
        let selectorEl = document.querySelector(`${selector}[class*="${el}"]`);
        if(selectorEl)
        {
            let classExist = selectorEl.classList.length;
            for (let i = classExist - 1; i >= 0; i--) {

                let className = selectorEl.classList[i];
                if (className.startsWith(el)) {
                    selectorEl.classList.remove(className);
                }
            }
        }else {
            return false;
        }
    });
}
/* play ground */
// $('.list-nav-col').append($('<div>').load('nav-post-login.html'));