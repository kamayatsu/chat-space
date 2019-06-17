$(document).on('turbolinks:load', function () {
  function buildHTML(message) {
    var body = message.body ? `${message.body}` : "";
    var image = message.image ? `${message.image}` : "";
    var html = `<div class="message" data-id="${message.id}">
                  <div class="message__user">
                    ${message.user_name}
                  </div>
                  <div class="message__day">
                    ${message.created_at}
                  </div>
                  <div class="message__content">
                    <div class="message__content__body">
                      ${body}
                    </div>
                    <div class="message__content__image">
                      <img src=${image}> 
                    </div>
                  </div>
                </div>`
    return html;
  }

  function scrollBottom() {
    var position = $('.messages')[0].scrollHeight;
    var speed = 1000;
    $('.messages').animate({ scrollTop: position }, speed, 'swing');
  }

  var reloadMessages = function () {
    //カスタムデータ属性のIDを取得
    last_message_id = $('.message:last').data('id');
    $.ajax({
      url: '/api/messages',
      type: 'GET',
      dataType: 'json',
      data: { id: last_message_id }
    })
      .done(function (messages) {
        console.log('success');
      })
      .fail(function () {
        console.log('error');
      })
  }

  $('.new_message').on('submit', function (e) {
    e.preventDefault();
    var message = new FormData(this);
    var url = $(this).attr('action');

    $.ajax({
      type: 'POST',
      url: url,
      data: message,
      dataType: 'json',
      processData: false,
      contentType: false
    })
      .done(function (message) {
        var html = buildHTML(message);
        $('.messages').append(html);
        $('.new_message')[0].reset();
        scrollBottom();
      })
      .fail(function () {
        alert('error');
      })
      .always(function () {
        setTimeout(function () {
          $('.send').removeAttr('disabled');
        });
      })
  });
});