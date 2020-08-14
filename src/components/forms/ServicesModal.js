import React from "react";
import {
  View,
  Text,
} from "react-native";

class Modal extends React.Component {
    render() {
      // Render nothing if the "show" prop is false
      if(!this.props.show) {
        return null;
      }
  
      return (
          <View>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    <Text>Add Service</Text>
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={this.props.onClose}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                  <div className="relative p-6 flex-auto">
                      <div className="flex flex-wrap -mx-3 mb-6">
                          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                  Service Name
                              </label>
                              <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="serviceName" name="serviceName" type="text" onChange={event => this.props.onInput('serviceName', event)}>
                                  <option>Please Select a service</option>
                                  <option>Gas</option>
                                  <option>Electric</option>
                                  <option>Water</option>
                              </select>
                          </div>
                          <div className="w-full md:w-1/2 px-3">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  <Text>Provider</Text>
                              </label>
                              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="currentSupplier" name="currentSupplier" type="text" placeholder="Enter your current supplier" onChange={event => this.props.onInput('currentSupplier', event)}/>
                          </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  <Text>Contract End Date</Text>
                              </label>
                              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="contractDate" name="contractDate" onChange={event => this.props.onInput('contractDate', event)} type="date"/>
                          </div>
                          <div className="w-full md:w-1/2 px-3">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  <Text>Contract Length</Text>
                              </label>
                              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="contractLength" name="contractLength" type="text" onChange={event => this.props.onInput('contractLength', event)}/>
                          </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  <Text>Bill Upload</Text>
                              </label>
                              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="contractDate" name="contractDate" onChange={event => this.props.onInput('contractDate', event)} type="date"/>
                          </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                          <div className="w-full px-3 border-b border-solid border-gray-300 rounded-t">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  <Text>Callback</Text>
                              </label>
                              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                <Text>Add date time you would like a call from one of our partners</Text>
                              </p>
                          </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                          <div className="w-full md:w-1/2 px-3">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  <Text>Callback Time</Text>
                              </label>
                              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="requestCall" name="requestCall" type="time" onChange={event => this.props.onInput('callback_time', event)}/>
                          </div>
                          <div className="w-full md:w-1/2 px-3">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  <Text>Callback Date</Text>
                              </label>
                              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="requestCall" name="requestCall" type="date" onChange={event => this.props.onInput('callback_date', event)}/>
                          </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                          <div className="w-full px-3 border-b border-solid border-gray-300 rounded-t">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  <Text>Costs</Text>
                              </label>
                              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                <Text>Add your yearly costs below and will estimate the monthly costs</Text>
                              </p>
                          </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                          <div className="w-full md:w-1/2 px-3">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  <Text>Cost Per Year</Text>
                              </label>
                              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="cost_year" name="cost_year" type="number" min="0.01" step="0.01" max="250000" onChange={event => this.props.onInput('cost_year', event)}/>
                          </div>
                          <div className="w-full md:w-1/2 px-3">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                  <Text>Cost Per Month</Text>
                              </label>
                              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                              id="cost_month" name="cost_month" type="number" min="0.01" step="0.01" max="2500" onChange={event => this.props.onInput('cost_month', event)}/>
                          </div>
                      </div>
                  </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                  <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                      onClick={this.props.onClose}
                  >
                    <Text>Close</Text>
                  </button>
                  <button
                      className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                      onClick={this.props.submitLead}
                  >
                      <Text>Add Service</Text>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </View>
      );
    }
  }
  
  export default Modal;