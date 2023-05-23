import { Button, Icon, Text, useTheme } from '@rneui/themed'
import React from 'react'
import { useSelector } from '../../redux/hook';
import { followUser } from '../../api/user.api';
import { pullUser } from '../../util/user2';

export function FollowButton({ userId, size = 'sm' }: {
    userId: string,
    size?: "sm" | "md" | "lg",
}) {
    const { theme } = useTheme();
    const { _id, follow } = useSelector(state => state.user);

    const isFollowed = follow?.includes(userId);
    const color = isFollowed ? theme.colors.black : theme.colors.white
    if (_id === userId) {
        return <></>
    }
    return (
        <Button
            size={size}
            color={isFollowed ? theme.colors.disabled : theme.colors.primary}
            onPress={
                () => {
                    followUser(userId).then((
                        { ok }
                    ) => {
                        if (ok) {
                            pullUser()
                        }
                    })
                }
            }
            title={<>
                <Icon name={isFollowed ? 'check' : 'plus'} type='antdesign' color={color} size={14} />
                <Text style={{ color: color }}>关注</Text>
            </>}
        />
    )
}
