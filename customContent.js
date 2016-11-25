/**
 * Classe desenvolvida para criar um contexto de eventos que renderizam containers de conteúdos customizados
 * @class
 */
module.exports = function() {

  /**
   * Encapsulamento do contexto principal para ser acessado nos contextos internos das funções
   * @type Object
   */
  var self = this;

  /**
   * Variável global que guardará os elementos que servirão de base para a criação de containers
   * @type Array
   */
  self.elements = [];


  /**
   * Variável contendo o body do documento
   * @type Object
   */
  var documentBody = document.querySelector('body');

  /**
   * Função para selecionar todos os elementos que gerarão conteúdo customizado
   * @return Array lista de elementos selecionados
   */
  var selectElements = function() {
    self.elements = document.querySelectorAll('[data-content-type]');
    return self.elements;
  };

  /**
   * Função para destruir um container específico
   * @param  Integer indexElement índice do container que será destruído
   */
  var destroyContainer = function(indexElement) {
    if(document.querySelectorAll('.container-content-overlay-'+indexElement).length) {
      documentBody.removeChild(
        document.querySelector('.container-content-overlay-'+indexElement)
      );
    }
    documentBody.classList.remove('custom-content-active');
  };

  /**
   * Destroi todos os containers
   */
  var destroyAll = function() {
    var containers = document.querySelectorAll('.container-content-overlay');
    for(var c = 0;c < containers.length;c++){
      documentBody.removeChild(containers[c]);
    }
    documentBody.classList.remove('custom-content-active');
  };

  /**
   * Função para criar ou selecionar um container
   * @param  Integer indexElement índice do container
   * @return Element retorna um container
   */
  var generateContainer = function(indexElement) {
    if(document.querySelectorAll('.container-content-overlay-'+indexElement).length) {
      return document.querySelector('.container-content-overlay-'+indexElement).querySelector('.container-content');
    } else {
      var div = document.createElement('div');
      var divContent = document.createElement('div');

      div.classList.add('container-content-overlay');
      div.classList.add('container-content-overlay-'+indexElement);

      divContent.classList.add('container-content');
      divContent.innerHTML = '<a href=\"javascript:destroyContainer(\''+indexElement+'\')\" class=\"close\"></a>';
      div.appendChild(divContent);

      documentBody.appendChild(div);
      documentBody.classList.add('custom-content-active');
      return divContent;
    }
  };

  /**
   * Renderiza um container com um conteúdo do tipo "vídeo"
   * @param  Element el    link que configurará um container
   * @param  Integer index index do link para controle de conteúdo
   */
  var renderVideo = function(el, index) {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      destroyAll();

      var iframeContainer = document.createElement('div');
      iframeContainer.className = 'video-container';
      iframeContainer.innerHTML = '<iframe class="" src="http://www.youtube.com/embed/' + el.getAttribute('href') + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';

      if(generateContainer(index).querySelector('iframe') == undefined) {
        generateContainer(index).appendChild(iframeContainer);
      }
    }, false);
  };

  /**
   * Renderiza um container com um conteúdo do tipo "imagem"
   * @param  Element el    link que configurará um container
   * @param  Integer index index do link para controle de conteúdo
   */
  var renderImage = function(el, index) {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      destroyAll();

      var img = document.createElement('img');
      img.setAttribute('src', el.getAttribute('href'));

      if(generateContainer(index).querySelector('img') == undefined) {
        generateContainer(index).appendChild(img);
      }
    }, false);
  };

  /**
   * Renderiza um container com um conteúdo do tipo "página"
   * @param  Element el    link que configurará um container
   * @param  Integer index index do link para controle de conteúdo
   */
  var renderPage = function(el, index) {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      destroyAll();

      var container = generateContainer(index);
      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
          var html = document.createElement('html');
          var content = document.createElement('div');

          html.innerHTML = xhttp.responseText;
          content.innerHTML = html.querySelector('#layout-main').innerHTML;
          container.appendChild(content);
        }
      };

      xhttp.open('GET', el.getAttribute('href'));
      xhttp.send();
    }, false);
  };


  /**
   * Função genérica para rendirizar algum tipo de conteúdo
   * @param  Element el    link que configurará um container
   * @param  Integer index index do link para controle de conteúdo
   */
  var render = function(el, index) {
    switch(el.getAttribute('data-content-type')) {
      case 'page':
        renderPage(el, index);
        break;
      case 'image':
        renderImage(el, index);
        break;
      case 'video':
        renderVideo(el, index);
        break;
      default:
        console.warn('não foi possível identificar o tipo de conteúdo');
    }
  };

  /**
   * Função auto-executável que inicia a configuração do fluxo das funções
   */
  !(function() {
    var elements = selectElements();
    for(var e = 0;e < elements.length;e++){
      render(elements[e], e);
    }
    window.destroyContainer = destroyContainer;
  })();
};
