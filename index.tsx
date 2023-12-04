import { OmnichannelChatSDK } from "@microsoft/omnichannel-chat-sdk";
import { LiveChatWidget } from "@microsoft/omnichannel-chat-widget";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const getOmnichannelChatConfig = () => {
    // add your own OC setting, hard-coded just for sample, should be replaced with a better handling
    const omnichannelConfig = { 
        orgId: "2fdcd11f-0d8d-ee11-8175-6045bdcf35ab",
        orgUrl: "https://unq2fdcd11f0d8dee1181756045bdcf3-crm11.omnichannelengagementhub.com",
        widgetId: "8e2916fb-7c8e-4761-abd5-7386aee22d73"
    };
    return omnichannelConfig;
}

const contextProvider = () => {
	//Here it is assumed that the corresponding work stream would have context variables with logical name of 'contextKey1', 'contextKey2', 'contextKey3'. If no context variable exists with a matching logical name, items are created assuming Type:string               
	return {
        'contextKey1': {'value': 'contextValue1', 'isDisplayable': true},
        'contextKey2': {'value': 12.34, 'isDisplayable': false},
        'contextKey3': {'value': true}
	};
}

const App = () => {
    const [liveChatWidgetProps, setLiveChatWidgetProps] = useState<any>();

    useEffect(() => {
        const init = async () => {
            const omnichannelConfig = getOmnichannelChatConfig();

            const chatSDK = new OmnichannelChatSDK(omnichannelConfig);
            chatSDK.setDebug(true);
            window.addEventListener("LCWChatButtonShow", function handleLivechatReadyEvent(){
                // Handle LiveChat Ready event
                // SDK methods are ready for use now
                // Setting custom context provider to be used with Chat for Dynamics 365
                // The custom context provided by custom context provider can be used for routing the chat to a particular queue
                //chatSDK.setContextProvider(contextProvider);
                const optionalParams = {
                    // preChatResponse: '', // PreChatSurvey response
                    // liveChatContext: {}, // EXISTING chat context data
                    // contextProvider, // Custom Context
                    customContext: contextProvider
                    // sendDefaultInitContext: true // Send default init context ⚠️ Web only
                };
                // Starting a new chat
                console.log("About to start chat.");
                console.log(chatSDK);
                chatSDK.startChat(optionalParams);
                console.log('Started chat successfully.');
            });
            
            window.addEventListener("lcw:error", function handleLivechatErrorEvent(errorEvent){
                // Handle LiveChat SDK error event
                console.log(errorEvent);
            });

            await chatSDK.initialize();
            const chatConfig = await chatSDK.getLiveChatConfig();

            const liveChatWidgetProps = {
                styleProps: {
                    generalStyles: {
                        width: "400px",
                        height: "600px",
                        bottom: "30px",
                        right: "30px"
                    }
                },
                chatSDK,
                chatConfig,
                webChatContainerProps:{
                    disableMarkdownMessageFormatting : true, //setting the default to true for a known issue with markdown
                }
            };

            setLiveChatWidgetProps(liveChatWidgetProps);

            const optionalParams = {
                // preChatResponse: '', // PreChatSurvey response
                // liveChatContext: {}, // EXISTING chat context data
                // contextProvider, // Custom Context
                customContext: contextProvider
                // sendDefaultInitContext: true // Send default init context ⚠️ Web only
            };
            // Starting a new chat
            console.log("About to start chat.");
            console.log(chatSDK);
            chatSDK.startChat(optionalParams);
            console.log('Started chat successfully.');
            }

        init();
    }, []);

    return (
        <div>
            {liveChatWidgetProps && <LiveChatWidget {...liveChatWidgetProps} />}
        </div>
    );
};

ReactDOM.render(<App/>,document.getElementById("root"));