$(function () {

  var searchList = $('#user-search-result');

  function appendUser(user) {
    var html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${user.name}</p>
                  <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</div>
                </div>`
    searchList.append(html);
  }

  function appendErrMsgToHTML(msg) {
    var html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${msg}</p>
                </div>`
    searchList.append(html);
  }

  $('.chat-group-form__field--right').on('keyup', function () {
    var input = $('#user-search-field').val();
    var data = (input.length !== 0) ? input : false;
    var url = location.pathname;

    $.ajax({
      url: url,
      type: 'GET',
      data: { keyword: data },
      dataType: 'json'
    })
      .done(function (users) {
        $(searchList).empty();
        if (users.length !== 0) {
          users.forEach(function (user) {
            appendUser(user);
          });
        }
        else {
          appendErrMsgToHTML('一致するユーザはいません');
        }
      })
      .fail(function () {
        alert('ユーザー検索に失敗しました');
      })
  });
});