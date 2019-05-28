/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
    'csui/utils/letter-avatar-random-color/letter-avatar-colors'
], function (_, LetterAvatarColor) {

    var UserAvatarColor = {

        getUserAvatarColor: function (user) {
            if (!user || _.isEmpty(user)) {
                return "";
            }
            var initials = (user.initials && user.initials.length > 1) ? user.initials : (user.name ? user.name.substring(0, 2) : "");
            return LetterAvatarColor.getLetterAvatarColor(initials);
        }

    };
    return UserAvatarColor;
});
