/**
 * html5 上传图片
 */
define(function(require, exports, module) {
    
    var getId = require('getId');

    var uploadPic = function(el,op,url){

        this.file = $(el);
        this.po = {}; // 需要传走的参数
        this.po = $.extend(this.po,op);
        this.url = url || "/index.php?mod=shenpi&op=index&act=application_upload"
        
        this.init();
    }


    uploadPic.prototype = {

        init : function(){
            this.addEvent();
        },
        updata : function(name,fileList,id){
            var t = this;
            this.xhr = new XMLHttpRequest();
            this.xhr.open("post", t.url, true);
            this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

            this.xhr.upload.addEventListener("progress", function(e){
                $(t).trigger('onProgress',{
                    result: e,
                    id :id,
                    name : fileList[0].name
                })
            }, false);
            this.xhr.addEventListener("load", function(e){
                var result = jQuery.parseJSON(e.target.responseText);
                if(result.status == "0"){
                    console.log(e.target.naturalWidth)
                    $(t).trigger('onLoad',{ 
                        result : result,
                        id : id,
                        name : fileList[0].name
                    })
                }else{
                    $(t).trigger('onLoadFailure',{ 
                        result : result,
                        id : id,
                        name :fileList[0].name
                    })
                }
                
            }, false);


            var fd = new FormData();
            fd.append(name, fileList[0]);
            for(var i  in this.po){
                fd.append(i, this.po[i]);
            }

            this.xhr.send(fd);
        },

        addEvent : function(){
            var t = this;
            this.file.on('change',function(e){
                var name = $(this).attr('name');
                var fileList = this.files;
                var id = getId();
                t.updata(name,fileList,id)

            })
            


        }



    }

    return uploadPic

})