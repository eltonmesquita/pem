/**
 * A small library to load dynamic content in a progressive enhanced way
 * @class
 */
module.exports = function() {

  /**
   * Encapsulamento do contexto principal para ser acessado nos contextos internos das funções
   * @type Object
   */
  var self = this;

  /**
   * Global variable that will hold the elements that will serve as a base for containers generation
   * @type Array
   */
  self.elements = [];


  /**
   * Document's' body
   * @type Object
   */
  var documentBody = document.querySelector('body');

  /**
   * Selects all the elements which will generate contents
   * @return Array - list of selected elements
   */
  var selectElements = function() {
    self.elements = document.querySelectorAll('[data-content-type]');
    return self.elements;
  };

  /**
   * Destroys a specific container
   * @param  Integer indexElement - Index of the container to be destroyed
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
   * Destroy all containers
   */
  var destroyAll = function() {
    var containers = document.querySelectorAll('.container-content-overlay');
    for(var c = 0;c < containers.length;c++){
      documentBody.removeChild(containers[c]);
    }
    documentBody.classList.remove('custom-content-active');
  };

  /**
   * Creates or generates a container
   * @param  Integer indexElement - Container's index
   * @return Element - returns a container
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
   * Renders a container with type "video"
   * @param  Element el    - Link that'll configure a container
   * @param  Integer index - Link's index to control the content
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
   * Renders a container with type "image"
   * @param  Element el    - Link that'll configure a container
   * @param  Integer index - Link's index to control the content
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
   * Renders a container with type "page"
   * @param  Element el    - Link that'll configure a container
   * @param  Integer index - Link's index to control the content
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
   * Renders the proper type of content
   * @param  Element el    - Link that'll configure a container
   * @param  Integer index - Link's index to control the content
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
   * Init the library
   */
  !(function() {
    var elements = selectElements();
    for(var e = 0;e < elements.length;e++){
      render(elements[e], e);
    }
    window.destroyContainer = destroyContainer;
  })();
};
