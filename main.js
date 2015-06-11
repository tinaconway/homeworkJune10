$(document).ready(function () {
  page.init();
});
var count;
var page = {

  url: "http://tiy-fee-rest.herokuapp.com/collections/tinaconway",
  init: function () {
    page.initStyling();
    page.initEvents();
  },
  initStyling: function () {
    page.loadPosts();
    page.loadItemsLeft();
  },
  initEvents: function () {
    $('.list').on('click', 'input', function () {input.value=""});
    $('.selectedButtons').on('click', '.complete', page.compileCompleted);
    $('.bottomRow').on('click', '.clearCompleted', page.clearComplete);
    $('.selectedButtons').on('click', '.delete', page.deletePost);
    $('.newToDoSubmit').on('click', page.addPost);
    $('.bottomRow').on('click', '.navButtons', page.navPages);
    $('.listElements').on('dblclick', '.element', function (e) {
      e.preventDefault();
      $(this).toggleClass('edit');
      $(this).next().toggleClass('active');
    });

    $('.listElements').on('click', '.submitEdit', function (e) {
      e.preventDefault();
      var $thisEditing = $(this).closest('.edit');
      var postId = $(this).closest('article').data('id');
      var updatedPost = {
        toDo: $thisEditing.find('.editContent').val(),
      };
      page.updatePost(updatedPost, postId);
    });
  },
  loadItemsLeft: function (){
    $.ajax({
      url: page.url,
      method: 'GET',
      success: function (data) {
      count= data.filter(function (el) {
      return (el.done === undefined);
        })
        count = count.length;
        console.log(count)
        page.addItemsLeftToDOM(data);
      },
      error: function (err) {
      }
    });

  },
  addItemsLeftToDOM: function (el) {
    page.loadTemplate("leftoverItems", el, $('.itemsLeft'));
  },
  addOnePostToDOM: function (post) {
    page.loadTemplate("post", post, $('.listElements'));
  },
  addAllPostsToDOM: function (postCollection) {
    $('.listElements').html('');
    _.each(postCollection, page.addOnePostToDOM);
  },
  addAllCompletedPostsToDOM: function (postCollection) {
    $('.listElements').html('');
    postCollection.forEach(function(post) {
      if (post.done === 'true') {
        page.loadTemplate('post', post, $('.listElements'));
      }
    })
  },
  addAllActivePostsToDOM: function (postCollection) {
    $('.listElements').html('');
    postCollection.forEach(function(post) {
      if (post.hasOwnProperty('done')) {
      }
      else {
        page.loadTemplate('post', post, $('.listElements'));
      }
    })
  },
  clearAllCompletedToDOM: function (postCollection) {
    postCollection.forEach(function(post) {
      if (post.done === 'true') {
        $.ajax({
          url: page.url + "/" + $(this).closest('article').data('id'),
          method: 'DELETE',
          success: function (data) {
            console.log("success");

          }
        })
      }
    })
  },
  compileCompleted: function(e) {
    e.preventDefault();
    $('.listElements input.checklist').each(function(){
        if ($(this).prop('checked')) {
          $(this).prop('checked', false);
          $.ajax({
            url: page.url + "/" + $(this).closest('article').data('id'),
            method: 'PUT',
            data: {done: true},
            success: function (data) {
              $('.itemsLeft').html('');
              page.loadItemsLeft();
            }
          });
        }
      });
  },
  clearComplete: function(e) {
    e.preventDefault();
    $.ajax({
      url: page.url,
      method: 'GET',
      success: function (data) {
        page.clearAllCompletedToDOM(data);
      },
      error: function (err) {
      }
    });

  },
  loadPosts: function () {
    $.ajax({
      url: page.url,
      method: 'GET',
      success: function (data) {
        page.addAllPostsToDOM(data);
      },
      error: function (err) {
      }
    });
  },
  createPost: function (newPost) {
    $.ajax({
      url: page.url,
      method: 'POST',
      data: newPost,
      success: function (data) {
        page.addOnePostToDOM(data);
        $('.itemsLeft').html('');
        page.loadItemsLeft();
      },
      error: function (err) {
      }
    });
  },
  updatePost: function (editedPost, postId) {
    $.ajax({
      url: page.url + '/' + postId,
      method: 'PUT',
      data: editedPost,
      success: function (data) {
        $('.listElements').html('');
        page.loadPosts();
      },
      error: function (err) {}
    });
  },
  deletePost: function(e) {
    e.preventDefault();
    $('.listElements input.checklist').each(function(){
        if ($(this).prop('checked')) {
          $.ajax({
            url: page.url + "/" + $(this).closest('article').data('id'),
            method: 'DELETE',
            success: function (data) {
              $('.listElements').html('');
              page.loadPosts();
              $('.itemsLeft').html('');
              page.loadItemsLeft();
            }
          })
        }
    })
  },
  navPages: function (event) {
    event.preventDefault();
    var clickedPage = $(this).attr('rel');
    $(clickedPage).siblings().removeClass('active');
    $(clickedPage).addClass('active');
    if (clickedPage === '.completedPage') {
      $.ajax({
        url: page.url,
        method: 'GET',
        success: function (data) {
              page.addAllCompletedPostsToDOM(data);
            },
        error: function (err) {
            }
      });
    }
    if (clickedPage === '.activePage') {
      $.ajax({
        url: page.url,
        method: 'GET',
        success: function (data) {
              page.addAllActivePostsToDOM(data);
            },
        error: function (err) {
            }
      });
    }
    if (clickedPage === '.allPage') {
      $.ajax({
        url: page.url,
        method: 'GET',
        success: function (data) {
          page.addAllPostsToDOM(data);
            },
        error: function (err) {
            }
      });
    }
  },


  addPost: function (event) {
    event.preventDefault();

    // build an object that looks like our original data
    var newPost = {
      toDo: $('input[name="toDo"]').val(),
    };

    page.createPost(newPost);
    $('.itemsLeft').html('');
    page.loadItemsleft();

    // clear form
    $('input, textarea').val("");
  },
  loadTemplate: function (tmplName, data, $target) {
    var compiledTmpl = _.template(page.getTemplate(tmplName));

    $target.append(compiledTmpl(data));
  },
  getTemplate: function (name) {
    return templates[name];
  }
};
