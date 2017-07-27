function SequenceUtil(){
    this.length = 0;
    this.init = initSequenceUtil;
    this.getSequence = getSequence;
    this.sequenceArray = new Array();  
}

function setValue(index){
	if(index){
		if(this.sequenceArray.length > index){
			this.sequenceArray[index] = 1;
		}
	}
}

function getValue(Integer index){
	if(  0 <= index && index < this.sequenceArray.length  ){
		return this.sequenceArray[index];
	}else{
		return null;
	}
}

function initSequence(length){
	this.length = length;
	this.sequenceArray = new Array(length);
}

function getSequence(){
	var sequenceTemp = "";
	for(var i = 0; i < this.sequenceArray.length ;i++){
		var temp = this.sequenceArray[i];
		if(temp == null || temp == ""){
			temp = "0";
		}
		if(i < this.sequenceArray.length -1){
			sequenceTemp += temp +",";
		}else{
			sequenceTemp += temp;
		}
	}
	return this.sequenceTemp;
}