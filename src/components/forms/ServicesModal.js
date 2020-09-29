import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  Button,
  Picker
} from "react-native";

class Modal extends React.Component {
    render() {
      // Render nothing if the "show" prop is false
      if(!this.props.show) {
        return null;
      }
  
      return (
          <View>
          <View className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <View className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <View className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <View className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                    <Text className="text-3xl font-semibold">Add Service</Text>
                  <TouchableHighlight
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={this.props.onClose}
                  >
                    <Text className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </Text>
                  </TouchableHighlight>
                </View>
                {/*body*/}
                  <View className="relative p-6 flex-auto">
                      <View className="flex flex-wrap -mx-3 mb-6">
                          <View className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                  Service Name
                              </Text>
                              <Picker className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="serviceName" name="serviceName" type="text" onChange={event => this.props.onInput('serviceName', event)}>
                                  <Picker.Item>Please Select a service</Picker.Item>
                                  <Picker.Item>Gas</Picker.Item>
                                  <Picker.Item>Electric</Picker.Item>
                                  <Picker.Item>Water</Picker.Item>
                              </Picker>
                          </View>
                          <View className="w-full md:w-1/2 px-3">
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  Provider
                              </Text>
                              <TextInput className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="currentSupplier" name="currentSupplier" type="text" placeholder="Enter your current supplier" onChange={event => this.props.onInput('currentSupplier', event)}/>
                          </View>
                      </View>
                      <View className="flex flex-wrap -mx-3 mb-6">
                          <View className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  Contract End Date
                              </Text>
                              <TextInput className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="contractDate" name="contractDate" onChange={event => this.props.onInput('contractDate', event)} type="date"/>
                          </View>
                          <View className="w-full md:w-1/2 px-3">
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  Contract Length
                              </Text>
                              <TextInput className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="contractLength" name="contractLength" type="text" onChange={event => this.props.onInput('contractLength', event)}/>
                          </View>
                      </View>
                      <View className="flex flex-wrap -mx-3 mb-6">
                          <View className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  Bill Upload
                              </Text>
                              <TextInput className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="contractDate" name="contractDate" onChange={event => this.props.onInput('contractDate', event)} type="date"/>
                          </View>
                      </View>
                      <View className="flex flex-wrap -mx-3 mb-6">
                          <View className="w-full px-3 border-b border-solid border-gray-300 rounded-t">
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  Callback
                              </Text>
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Add date time you would like a call from one of our partners
                              </Text>
                          </View>
                      </View>
                      <View className="flex flex-wrap -mx-3 mb-6">
                          <View className="w-full md:w-1/2 px-3">
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  Callback Time
                              </Text>
                              <TextInput className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="requestCall" name="requestCall" type="time" onChange={event => this.props.onInput('callback_time', event)}/>
                          </View>
                          <View className="w-full md:w-1/2 px-3">
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  <Text>Callback Date</Text>
                              </Text>
                              <TextInput className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="requestCall" name="requestCall" type="date" onChange={event => this.props.onInput('callback_date', event)}/>
                          </View>
                      </View>
                      <View className="flex flex-wrap -mx-3 mb-6">
                          <View className="w-full px-3 border-b border-solid border-gray-300 rounded-t">
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  <Text>Costs</Text>
                              </Text>
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Add your yearly costs below and will estimate the monthly costs
                              </Text>
                          </View>
                      </View>
                      <View className="flex flex-wrap -mx-3 mb-6">
                          <View className="w-full md:w-1/2 px-3">
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  Cost Per Year
                              </Text>
                              <TextInput className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="cost_year" name="cost_year" type="number" min="0.01" step="0.01" max="250000" onChange={event => this.props.onInput('cost_year', event)}/>
                          </View>
                          <View className="w-full md:w-1/2 px-3">
                              <Text className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  Cost Per Month
                              </Text>
                              <TextInput className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="cost_month" name="cost_month" type="number" min="0.01" step="0.01" max="2500" onChange={event => this.props.onInput('cost_month', event)}/>
                          </View>
                      </View>
                  </View>
                {/*footer*/}
                <View className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                  <Button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                      onClick={this.props.onClose}
                      title="Close"
                  >
                    <Text>Close</Text>
                  </Button>
                  <Button
                      className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                      onClick={this.props.submitLead}
                      title="Add"
                  >
                      <Text>Add Service</Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
          <View className="opacity-25 fixed inset-0 z-40 bg-black"></View>
        </View>
      );
    }
  }
  
  export default Modal;