export class LikeUserDto {
    userStatus: 'None' | 'Like' | 'Dislike'
    addedAt: string
    userId: string
    login: string
}