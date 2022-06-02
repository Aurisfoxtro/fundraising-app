import {DataTypes} from 'sequelize'
import {users} from './users.js'

export const profile = (sequelize) => {
    const schema = {
        // headline: {type: DataTypes.STRING},
        // subheadline: {type: DataTypes.STRING},
        description: {type: DataTypes.STRING},
        // hourly_rate: {type: DataTypes.INTEGER, allowNull: false},
        profile_image: {type: DataTypes.STRING},
        target_sum: {type: DataTypes.INTEGER},
        funded_sum: {type: DataTypes.INTEGER},
        funded_history_id: {type: DataTypes.INTEGER}
        // location: {type: DataTypes.STRING}
    }

    const Profile = sequelize.define('Profile', schema)
    // const Users = users(sequelize)

    // Users.hasOne(Profile, {foreignKey: 'userId'})
    // Profile.belongsTo(Users)

    // Users.hasOne(Profile)
    // Profile.belongsTo(Users)

    return Profile
}