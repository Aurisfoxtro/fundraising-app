import {DataTypes} from 'sequelize'
import {profile} from './profile.js'

export const portfolio = (sequelize) => {
    const schema = {
        // image_url: {type: DataTypes.STRING, allowNull: false},
        // title: {type: DataTypes.STRING},
        // description: {type: DataTypes.TEXT}
        donator: {type: DataTypes.STRING, allowNull: false},
        donation: {type: DataTypes.INTEGER, allowNull: false}
    }

    const Portfolio = sequelize.define('Portfolio', schema)
    const Profile = profile(sequelize)

    Profile.hasMany(Portfolio)
    Portfolio.belongsTo(Profile)

    return Portfolio
}