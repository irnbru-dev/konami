(function($, window){
    var ProfiTheme = window.ProfiTheme || {};

    ProfiTheme.KonamiCode = function(){
        $gameBase = $('#main-section');
        if($gameBase.length) {
            var $gameLayer = $('<div class="gameLayer hiddenTop"></div>'),
                $fightScene = $('<div class="fightScene"></div>'),
                $UILayer = $('<div class="UIScene">' +
                    '   <div class="menuUI">' +
                    '       <h5>CHOOSE YOUR SIDE</h5>' +
                    '       <div data-hero-name="batman" class="start-hero start-batman active"><img class="hero-logo" src="http://dev.iondigi.com/profi/konami-code/batman_logo_large.png"></div>' +
                    '       <div data-hero-name="super" class="start-hero start-super"><img class="hero-logo" src="http://dev.iondigi.com/profi/konami-code/super_logo_large.png"></div>' +
                    '       <img class="tutorial" style="display: none;" src="http://dev.iondigi.com/profi/konami-code/tutorial.png">' +
                    '   </div>' +
                    '   <div class="gameUI hidden fadeUp">' +
                    '       <div class="batman-ui hero-ui">' +
                    '           <img class="hero-logo" src="http://dev.iondigi.com/profi/konami-code/batman_logo.png">' +
                    '           <div class="hero-life"><div><i class="red-line"></i></div></div>' +
                    '       </div>' +
                    '       <img class="vs-img" src="http://dev.iondigi.com/profi/konami-code/vs.png">' +
                    '       <div class="super-ui hero-ui">' +
                    '           <img class="hero-logo" src="http://dev.iondigi.com/profi/konami-code/super_logo.png">' +
                    '           <div class="hero-life"><div><i class="red-line"></i></div></div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="gameOverUI hiddenTop">' +
                    '       <h3>{{gameStatus}}</h3>' +
                    '       <div class="closeGame">&#9747;</div>' +
                    '       <h5>Share with friends</h5>' +
                    '       <div class="shareLinks">' +
                    '           <div class="shareLink">' +
                    '               <div id="fb-root"></div><script>(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/uK_UK/sdk.js#xfbml=1&version=v2.5";fjs.parentNode.insertBefore(js, fjs);}(document, \'script\', \'facebook-jssdk\'));</script>' +
                    '               <div class="fb-share-button" data-href="'+location.href+'" data-layout="button_count"></div>' +
                    '           </div>' +
                    '           <div class="shareLink">' +
                    '               <script src="https://apis.google.com/js/platform.js" async defer></script><div class="g-plus" data-action="share" data-annotation="bubble"></div>' +
                    '           </div>' +
                    '           <div class="shareLink">' +
                    '               <a href="https://twitter.com/share" data-hashtags="profitheme" data-text="Click on link and enter konami code &#8593; &#8593; &#8595; &#8595; &#8592; &#8594; &#8592; &#8594; B A" data-url="http://themeforest.net/item/profi-business-professional-wordpress-theme/full_screen_preview/14873668"  class="twitter-share-button">Tweet</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\'://platform.twitter.com/widgets.js\';fjs.parentNode.insertBefore(js,fjs);}}(document, \'script\', \'twitter-wjs\');</script>' +
                    '           </div>' +
                    '       </div>' +
                    '       <h5 class="playAgain">Play Again</h5>' +
                    '   </div>' +
                    '</div>'),
                self = this;


            this.isOver = false;
            this.isAgain = false;
            this.isPlaying = false;
            this.isHit = false;
            this.hitsAI = false;
            this.$batman = $('<div class="batman heroes"></div>');
            this.$super = $('<div class="super heroes"></div>');


            $gameLayer.append($fightScene);
            $gameLayer.append($UILayer);

            $gameLayer.append(this.$batman);
            $gameLayer.append(this.$super);

            $gameBase.append($gameLayer);

            this.hitAudio = new Audio("http://dev.iondigi.com/profi/konami-code/hit.mp3");

            this.chooseHero = function(heroName, antiHeroName){

                this.hero = {
                    $node: this['$'+heroName],
                    hits: 0,
                    clearHits: false,
                    life: 100,
                    $lifeUI: $UILayer.find('.'+heroName+'-ui')
                }
                this.hero.$lifeUI.find('.hero-life').addClass('active').find('.red-line').css('left', '100%' );

                this.antihero = {
                    $node: this['$'+antiHeroName],
                    hits: 0,
                    clearHits: false,
                    life: 100,
                    $lifeUI: $UILayer.find('.'+antiHeroName+'-ui')
                }

                this.antihero.$lifeUI.find('.hero-life').removeClass('active').find('.red-line').css('left', '100%' );

                this.hero.against = this.antihero
                this.antihero.against = this.hero
            }

            this.startAIHits = function(){

                this.hitsAI = setInterval(function() {
                    self.doHit(self.antihero);
                }, 600);
                console.log(this.hitsAI);
            }

            this.stopAIHits = function(){
                clearInterval(this.hitsAI);
            }

            this.doHit = function(hero){
                if(this.isHit)
                    return;


                if(hero.hits > 3) {
                    if(hero.clearHits)
                        return;

                    hero.clearHits = setTimeout(function(){
                        hero.hits = 0;
                        hero.clearHits = false;
                    }, 800);

                    return;
                }
                this.isHit = true;

                self.hitAudio.play();

                hero.$node.toggleClass('hit');
                hero.against.$node.toggleClass('punched');
                hero.hits++;

                this.reduceLife(hero.against);

                setTimeout(function(){
                    hero.$node.toggleClass('hit');
                    hero.against.$node.toggleClass('punched');

                    self.isHit = false;
                }, 200);
            }

            this.reduceLife = function(against){
                against.life -= 5;
                against.$lifeUI.find('.red-line').css('left', against.life+'%' );

                if(against.life == 0) {
                    this.gameOver(against);
                }
            }

            this.gameOver = function(against){
                this.stopAIHits();
                this.isOver = true;
                this.isPlaying = false;

                setTimeout(function(){
                    against.$node.addClass('fall');
                },400);

                $UILayer.find('.gameOverUI').removeClass('hiddenTop').find('h3').text(((this.hero.life > 0)?'YOU WIN':'YOU LOSE'));
            }

            this.startGame = function(){

                console.log('startGameCall');

                $UILayer.find('.gameUI').removeClass('hidden');

                setTimeout(function(){
                    $UILayer.find('.gameUI').removeClass('fadeUp');

                    self.$batman.show().addClass('flicking');
                    self.$super.show().addClass('flicking');

                    setTimeout(function(){
                        self.$batman.removeClass('flicking');
                        self.$super.removeClass('flicking');
                        self.isPlaying = true;
                        self.startAIHits();
                    },2000);


                }, 100);


                if(!this.isAgain) {
                    $(window).on('click', function (event) {
                        if (self.isOver || !self.isPlaying)
                            return;

                        event.preventDefault();
                        self.doHit(self.hero);
                    });

                    $(window).on('keydown', function (event) {
                        if (event.keyCode != 32)
                            return;

                        event.preventDefault();

                        if (self.isOver  || !self.isPlaying)
                            return;
                        self.doHit(self.hero);
                    });
                }
            }

            this.closeStartScene = function () {

                $UILayer.find('.menuUI').addClass('fadeUp');

                if(!self.isAgain)
                    setTimeout(function(){
                        $UILayer.find('.tutorial').fadeIn(500);
                    },500);


                setTimeout(function(){
                    $UILayer.find('.tutorial').fadeOut(300);
                    $UILayer.find('.menuUI').fadeOut(500, function(){
                        self.startGame();
                    });

                }, (!self.isAgain)?3000:1000);
            }

            this.startMenu = function () {
                var timeToStart,
                    self = this;

                $UILayer.find('.start-hero').click(function(){
                    $(this).addClass('active').siblings('.start-hero').removeClass('active');
                    var heroName = $(this).data('hero-name');
                    var antiHeroName = $(this).siblings('.start-hero').eq(0).data('hero-name');

                    if(timeToStart)
                        clearInterval(timeToStart);

                    timeToStart = setTimeout(function(){
                        self.chooseHero(heroName, antiHeroName);
                        self.closeStartScene();
                    }, 1000);
                }).hover(function(){
                    $(this).addClass('active').siblings('.start-hero').removeClass('active');
                });
            }

            this.initialHeight = $gameBase.height();
            this.init = function(){
                if(this.initialHeight < 460)
                    $gameBase.height(460);

                $(document).scrollTop($gameBase.offset().top);

                $gameLayer.removeClass('hiddenTop');

                setTimeout(function(){
                    $gameLayer.addClass('init');
                    self.startMenu();
                },100);

                $gameLayer.find('.playAgain').on('click',function(){
                    self.restart();
                });

                $gameLayer.find('.closeGame').on('click',function(){
                    self.close();
                });
            }

            this.restart = function(){
                this.isOver = false;
                this.isAgain = true;

                $UILayer.find('.gameOverUI').addClass('hiddenTop');

                this.hero.$node.removeClass('fall').hide();
                this.antihero.$node.removeClass('fall').hide();

                $UILayer.find('.gameUI').addClass('hidden fadeUp');
                $UILayer.find('.menuUI').show();

                setTimeout(function(){
                    $UILayer.find('.menuUI').removeClass('fadeUp');
                }, 100);

            }

            this.close = function () {
                $gameLayer.fadeOut(500);
                $gameBase.height(this.initialHeight);
            }



            this.startWaitingCode = function () {
                var keyChain = '38384040373937396665';
                currentKeyChain = '',
                    self = this;

                $(window).on('keydown.konamiCodeKeys', function(event){

                    currentKeyChain += event.keyCode.toString();
                    if(currentKeyChain.match(keyChain)){
                        self.init();
                        $(window).off('keydown.konamiCodeKeys');
                        return;
                    }
                });
            }

            this.startWaitingCode();

        }
    }

    ProfiTheme.KonamiCode();



})(jQuery, window);