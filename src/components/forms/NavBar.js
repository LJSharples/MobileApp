import React, { Component} from "react"
import TabBar, { iconTypes } from "react-native-fluidbottomnavigation";

export default class NavBar extends Component{
    render(){
        if(this.props.affilaite === true){
            return(
                <TabBar
                    activeTab={this.props.index}
                    iconStyle={{ width: 50, height: 50 }}
                    tintColor="#2F82EC"
                    onPress={(tabIndex) => {
                        this.props._handlePressAffiliate(tabIndex);
                    }}
                    iconActiveTintColor="black"
                    iconInactiveTintColor="#2F82EC"
                    tintColor="#f5f5f7"
                    titleColor="#999999"
                    isRtl={ false }
                    iconSize={25}
                    values={[
                    { title: "Dashboard", icon: "home", tintColor: this.props.index == 0 ? "#2F82EC" : "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons, activeTab:this.props.activeTab[1]},
                    { title: "Customers", icon: "md-document", tintColor: this.props.index == 1 ? "#2F82EC" : "#bee3f8", isIcon: true, iconType: iconTypes.Ionicons, activeTab:this.props.activeTab[2]},
                    { title: "Expenses", icon: "md-wallet", tintColor: this.props.index == 2 ? "#2F82EC" : "#bee3f8", isIcon: true, iconType: iconTypes.Ionicons, activeTab:this.props.activeTab[3]},
                    { title: "Affiliates", icon: "redo-variant", tintColor: this.props.index == 3 ? "#2F82EC" : "#bee3f8", isIcon: true, iconType: iconTypes.MaterialCommunityIcons, activeTab:this.props.activeTab[4]},
                    { title: "Profile", icon: "person-outline", tintColor: this.props.index == 4 ? "#2F82EC" : "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons, activeTab:this.props.activeTab[5]},
                    ]}
                />
            )
        } else {
            return(
                <TabBar
                    activeTab={this.props.index}
                    iconStyle={{ width: 50, height: 50 }}
                    tintColor="#2F82EC"
                    onPress={(tabIndex) => {
                        this.props._handlePress(tabIndex);
                    }}
                    iconActiveTintColor="black"
                    iconInactiveTintColor="#2F82EC"
                    tintColor="#f5f5f7"
                    titleColor="#999999"
                    isRtl={ false }
                    iconSize={25}
                    values={[
                    { title: "Dashboard", icon: "home", tintColor: this.props.index == 0 ? "#2F82EC" : "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons, activeTab:this.props.activeTab[1]},
                    { title: "Services", icon: "md-document", tintColor: this.props.index == 1 ? "#2F82EC" : "#bee3f8", isIcon: true, iconType: iconTypes.Ionicons, activeTab:this.props.activeTab[2]},
                    { title: "Expenses", icon: "md-wallet", tintColor: this.props.index == 2 ? "#2F82EC" : "#bee3f8", isIcon: true, iconType: iconTypes.Ionicons, activeTab:this.props.activeTab[3]},
                    { title: "Get Quote", icon: "redo-variant", tintColor: this.props.index == 3 ? "#2F82EC" : "#bee3f8", isIcon: true, iconType: iconTypes.MaterialCommunityIcons, activeTab:this.props.activeTab[4]},
                    { title: "Profile", icon: "person-outline", tintColor: this.props.index == 4 ? "#2F82EC" : "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons, activeTab:this.props.activeTab[5]},
                    ]}
                />
            )
        }
    }
}