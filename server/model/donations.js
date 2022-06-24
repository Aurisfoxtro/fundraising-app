import {DataTypes} from 'sequelize'
import {profile} from './profile.js'

export const donations = (sequelize) => {
    const schema = {
        donator: {type: DataTypes.STRING, allowNull: false},
        donation: {type: DataTypes.INTEGER, allowNull: false}
    }

    const Donations = sequelize.define('Donations', schema)
    const Profile = profile(sequelize)

    Profile.hasMany(Donations)
    Donations.belongsTo(Profile)

    return Donations
}