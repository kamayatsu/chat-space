//turbolinksの仕様で初回読み込み時にajaxが機能しないため下記を追加
$(document).on('turbolinks:load', function () {

  //変数とfunctionの定義
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

  //ここからajax
  $('.chat-group-form__field--right').on('keyup', function () {
    var input = $('#user-search-field').val();
    //inputの文字数が0の場合の対策
    var data = (input.length !== 0) ? input : false;

    $.ajax({
      url: '/users',
      type: 'GET',
      data: { keyword: data },
      dataType: 'json'
    })
      .done(function (users) {
        $(searchList).empty();
        //現在チャットメンバー欄にいる人の情報を格納するための配列を用意
        var already_exists = [];
        //already_existsに既存チャットメンバーを追加
        var targets = document.getElementsByClassName('targetclass');
        for (i = 0; i < targets.length; i++) {
          var member = { id: $(targets[i]).val() }
          already_exists.push(member);
        }
        //入力文字数が0か否かで分岐
        if (users.length !== 0) {
          users.forEach(function (user) {
            //someメソッドでalready_existsが既存チャットメンバーを含んでいるか確認し、判定結果を変数someに格納
            var some = already_exists.some(a => a.id === `${user.id}`);
            //someメソッドの結果、現在のチャットメンバーを含んでいなければ候補欄に追加
            if (!some) {
              appendUser(user);
            }
          });
          //上記の処理の結果、検索結果に何も表示されなければ実施
          if (!($('.user-search-add').text() == '追加')) {
            appendErrMsgToHTML('一致するユーザが見つかりません');
          }
        }
        else {
          appendErrMsgToHTML('一致するユーザが見つかりません');
        }
      })
      .fail(function () {
        alert('ユーザー検索に失敗しました');
      })
  });
});

//turbolinksの仕様で $(document).on('turbolinks:load', function の中に入れると処理が繰り返されるので、functionを分けている
$(function () {

  //処理を分けているため、追加・削除用のfunctionはこちらに定義
  function appendUserToGroup(user) {
    var html = `<div class='chat-group-user clearfix js-chat-member' id='chat-group-user-${user.id}'>
                  <input name='group[user_ids][]' type='hidden' value='${user.id}' class='targetclass'>
                  <p class='chat-group-user__name'>${user.name}</p>
                  <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</div>
                </div>`
    $('#chat-group-users').append(html);
  }

  //追加ボタンを押した時
  $(document).on('click', '.chat-group-user__btn--add', function () {
    var user_id = $(this).data('user-id');
    var user_name = $(this).data('user-name');
    var user = { id: user_id, name: user_name }
    $(this).parent().remove();
    appendUserToGroup(user);
  });

  //削除を含むボタンを押した時
  $(document).on('click', '.js-remove-btn', function () {
    $(this).parent().remove();
  });
});