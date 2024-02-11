
export class PeerService {
  peer: RTCPeerConnection | undefined;
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  async createNewOffer(
    sendValue: (arg0: string, arg1: string, arg2: any, arg3: string) => void,
    setCallData: (arg0: (prev: any) => any) => void,
    userContextData: any,
    receiverName: any
  ) {
    // Get candidates for caller, save to WebSocket
    this.peer.onicecandidate = (event) => {
      // Assuming obj is your RTCIceCandidate object
      var obj = event.candidate && {
        address: event.candidate.address,
        candidate: event.candidate.candidate,
        component: event.candidate.component,
        foundation: event.candidate.foundation,
        port: event.candidate.port,
        priority: event.candidate.priority,
        protocol: event.candidate.protocol,
        relatedAddress: event.candidate.relatedAddress,
        relatedPort: event.candidate.relatedPort,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid,
        tcpType: event.candidate.tcpType,
        type: event.candidate.type,
        usernameFragment: event.candidate.usernameFragment,
      };

      var jsonString = JSON.stringify(obj);

      obj &&
        sendValue(
          "private.message",
          jsonString,
          receiverName,
          EnumStatus[EnumStatus.CANDIDATE]
        );
    };
    setCallData((prev: any) => {
      return {
        ...prev,
        callerName: userContextData.username,
        receiverName: receiverName,
      };
    });

    // Create offer
    const offerDescription = await this.peer.createOffer();
    await this.peer.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    // Send the offer via WebSocket
    const message = { offer: offer, user: userContextData };
    sendValue(
      "private.message",
      JSON.stringify(message),
      receiverName,
      EnumStatus[EnumStatus.CALLOFFER]
    );
  }

  async getAnswer(offer: RTCSessionDescriptionInit) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  async setLocalDescription(ans: RTCSessionDescriptionInit) {
    if (this.peer) {
      console.log("this.peer: ", this.peer);
      
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));      
      return offer;
    }
  }
}
const peer = new PeerService();
export default peer;
