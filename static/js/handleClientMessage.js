'use strict';

const handleClientMessage = (() => {
  const handleClientMessage_USER_NEWINFO = (hook, context) => {
    const padId = pad.getPadId();

    contributors.increaseUserFromList(context.payload.userId, padId);
    return [];
  };
  const handleClientMessage_USER_LEAVE = (hook, context) => {
    const padId = pad.getPadId();

    contributors.decreaseUserFromList(context.payload.userId, padId);
    return [];
  };
  const handleClientMessage_CUSTOM = (hook, context, cb) => {
    const currentUserId = pad.getUserId();

    if (context.payload.action === 'totalUserHasBeenChanged') {
      const totalUserCount = context.payload.totalUserCount;
      $('#userlist_count').text(totalUserCount);
    }

    if (context.payload.action === 'EP_PROFILE_USER_IMAGE_CHANGE') {
      // when user A change image and user B want to know
      helper.refreshGeneralImage(context.payload.userId, context.payload.padId);
    }

    if (context.payload.action === 'EP_PROFILE_USER_LOGOUT_UPDATE') {
      const imageUrl = `/static/getUserProfileImage/${context.payload.userId}/${context.payload.padId}?t=${new Date().getTime()}`;

      if (currentUserId === context.payload.userId) {
        helper.refreshUserImage(currentUserId, context.payload.padId);
        helper.logoutCssFix(currentUserId);
      } else {
        helper.refreshGeneralImage(
            context.payload.userId,
            context.payload.padId
        );
      }

      syncData.resetGeneralFields(context.payload.userId);

      // making user as anonymous
      const onlineAnonymousSelector = contributors.isThereOnlineAnonymous();
      if (onlineAnonymousSelector) {
        contributors.increaseToOnlineAnonymous(
            onlineAnonymousSelector,
            context.payload.userId
        );
      } else {
        contributors.createOnlineAnonymousElement(
            context.payload.userId,
            'Anonymous',
            imageUrl,
            {}
        );
      }

      contributors.removeUserElementInUserList(context.payload.userId);
    }

    if (context.payload.action === 'EP_PROFILE_USER_LOGIN_UPDATE') {
      // related to user list when user has been loginned
      const onlineAnonymousSelector = contributors.isThereOnlineAnonymous();
      if (context.payload.userName === 'Anonymous') {
        if (onlineAnonymousSelector) {
          contributors.increaseToOnlineAnonymous(
              onlineAnonymousSelector,
              context.payload.userId
          );
        } else {
          contributors.createOnlineAnonymousElement(
              context.payload.userId,
              context.payload.userName,
              context.payload.img,
              context.payload.user
          );
        }

        contributors.removeUserElementInUserList(context.payload.userId);
      } else {
        if (onlineAnonymousSelector) {
          if (
            contributors.checkUserExistInOnlineAnonymous(
                onlineAnonymousSelector,
                context.payload.userId
            )
          ) {
            contributors.decreaseFromOnlineAnonymous(
                onlineAnonymousSelector,
                context.payload.userId
            );
          }
        }
        contributors.createOnlineUserElementInUserList(
            context.payload.userId,
            context.payload.userName,
            context.payload.img,
            currentUserId,
            context.payload.user
        );
      }

      // change owner loginned img at top of page
      if (currentUserId === context.payload.userId) {
        helper.refreshUserImage(currentUserId, context.payload.padId);
        syncData.syncAllFormsData(context.payload.userId, context.payload.user);

        // $("#ep_profile_modal_section_info_name").text(context.payload.userName);
      } else {
        helper.refreshGeneralImage(
            context.payload.userId,
            context.payload.padId
        );
        syncData.syncGeneralFormsData(
            context.payload.userId,
            context.payload.user
        );
      }
    }

    return [];
  };
  return {
    handleClientMessage_USER_NEWINFO,
    handleClientMessage_USER_LEAVE,
    handleClientMessage_CUSTOM,
  };
})();
