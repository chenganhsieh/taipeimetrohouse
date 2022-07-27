var PDFAnnotate = function(container_id, url, storageRef, dataRef, options = {}) {
    this.number_of_pages = 0;
    this.pages_rendered = 0;
    this.active_tool = 1; // 1 - Free hand, 2 - Text, 3 - Arrow, 4 - Rectangle, 5 - Image
    this.fabricObjects = [];
    this.fabricObjectsData = [];
    this.color = '#212121';
    this.borderColor = '#000000';
    this.borderSize = 1;
    this.font_size = 16;
    this.active_canvas = 0;
    this.container_id = container_id;
    this.url = url;
    this.storageRef = storageRef;
    this.dataRef = dataRef;
    this.width = 0;
    this.height = 0;

    var inst = this;

    var loadingTask = PDFJS.getDocument(this.url);
    loadingTask.promise.then(function(pdf) {

        var scale = 1;
        inst.number_of_pages = pdf.pdfInfo.numPages;

        for (var i = 1; i <= pdf.pdfInfo.numPages; i++) {
            pdf.getPage(i).then(function(page) {
                var viewport = page.getViewport(scale);
                var canvas = document.createElement('canvas');
                var div_container = document.getElementById(inst.container_id)
                document.getElementById(inst.container_id).appendChild(canvas);
                // const devicePixelRatio = window.devicePixelRatio || 1;
                const devicePixelRatio = 4
                canvas.className = 'pdf-canvas';
                // canvas.style.width = viewport.width;
                // canvas.style.height = viewport.width;

                canvas.height = viewport.height * devicePixelRatio; //actual size
                canvas.width = viewport.width * devicePixelRatio;
                // canvas.style.width = "100%";
                canvas.style.height = viewport.height; //showing size will be smaller size
                canvas.style.width = viewport.width;
                // canvas.style.height = "100%";
                console.log(viewport.height) // 1015
                console.log(viewport.width) //728

                inst.width = viewport.width;
                inst.height = viewport.height;
                context = canvas.getContext('2d');
                // [sx, 0, 0, sy, 0, 0]

                const transform = [devicePixelRatio, 0, 0, devicePixelRatio, 0, 0];
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                    transform: transform

                };
                var renderTask = page.render(renderContext);

                // div_container.style.width = Math.floor(viewport.width * devicePixelRatio / 10) + 'pt';
                // div_container.style.height = Math.floor(viewport.height * devicePixelRatio / 10) + 'pt';
                renderTask.then(function() {
                    $('.pdf-canvas').each(function(index, el) {
                        $(el).attr('id', 'page-' + (index + 1) + '-canvas');
                        console.log(el.width)
                        console.log(el.height)
                    });

                    inst.pages_rendered++;
                    if (inst.pages_rendered == inst.number_of_pages) inst.initFabric();
                });
            });
        }
    }, function(reason) {
        console.error(reason);
        alert("檔案已更新，請回系統重新點選")
    });



    this.initFabric = function() {
        var inst = this;
        $('#' + inst.container_id + ' canvas').each(function(index, el) {
            // console.log(el.width)
            var background = el.toDataURL("image/png", 1.0);
            var fabricObj = new fabric.Canvas(el.id, {
                // freeDrawingBrush: {
                //     width: 1,
                //     color: inst.color,

                // },
            });

            scaleRatioWidth = window.innerWidth / fabricObj.width;
            fabricObj.setHeight(fabricObj.height * scaleRatioWidth);
            fabricObj.setWidth(fabricObj.width * scaleRatioWidth);

            inst.fabricObjects.push(fabricObj);
            if (typeof options.onPageUpdated == 'function') {
                fabricObj.on('object:added', function() {
                    var oldValue = Object.assign({}, inst.fabricObjectsData[index]);
                    inst.fabricObjectsData[index] = fabricObj.toJSON()
                    options.onPageUpdated(index + 1, oldValue, inst.fabricObjectsData[index])
                })
            }
            fabricObj.setBackgroundImage(background, fabricObj.renderAll.bind(fabricObj), { scaleY: scaleRatioWidth, scaleX: scaleRatioWidth, });
            $(fabricObj.upperCanvasEl).click(function(event) {
                inst.active_canvas = index;
                inst.fabricClickHandler(event, fabricObj);
            });
            fabricObj.on('after:render', function() {
                inst.fabricObjectsData[index] = fabricObj.toJSON()
                fabricObj.off('after:render')
            });

            // window.addEventListener('resize', resizeCanvas, false);

            function resizeCanvas() {
                scaleRatioWidth = window.innerWidth / fabricObj.width;
                fabricObj.setHeight(fabricObj.height * scaleRatioWidth);
                fabricObj.setWidth(fabricObj.width * scaleRatioWidth);
                var objects = fabricObj.getObjects();
                for (var i in objects) {
                    objects[i].scaleX = objects[i].scaleX * scaleRatioWidth;
                    objects[i].scaleY = objects[i].scaleY * scaleRatioWidth;
                    objects[i].left = objects[i].left * scaleRatioWidth;
                    objects[i].top = objects[i].top * scaleRatioWidth;
                    objects[i].setCoords();
                }
                var obj = fabricObj.backgroundImage;

                if (obj) {
                    obj.scaleX = obj.scaleX * scaleRatioWidth;
                    obj.scaleY = obj.scaleY * scaleRatioWidth;
                }
                fabricObj.renderAll();
                fabricObj.calcOffset();
            }
            movePDF(true);




            inst.openDrag()
        });
    }

    this.fabricClickHandler = function(event, fabricObj) {
        var inst = this;
        if (inst.active_tool == 2) {
            var text = new fabric.IText('新增文字', {
                left: event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left,
                top: event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top,
                fill: inst.color,
                fontSize: inst.font_size,
                selectable: true
            });
            console.log(text)
            fabricObj.add(text);
            inst.active_tool = 1;
        } else if (inst.active_tool == 5) {
            $("#imgInp").off("change").change(function() {
                img_file = readURL(this);
                if (img_file != "" && img_file != null) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var image = new fabric.Image.fromURL(e.target.result, function(oImg) {
                            oImg.left = event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left;
                            oImg.top = event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top;
                            oImg.angle = 0;
                            oImg.opacity = 1;
                            fabricObj.add(oImg);
                            inst.active_tool = 1;
                        });
                    }
                    reader.readAsDataURL(img_file); // convert to base64 string
                }
            });
            $("#imgInp").click();
        };

    }
    this.openDrag = function() {
        var clicked = false,
            clickY, clickX, dis1, dis2;
        let scaleVactor = 1;
        $(document).on({
            // 'mousemove': function(e) {
            //     clicked && updateScrollPos(e);
            // },
            // 'mousedown': function(e) {
            //     clicked = true;
            //     clickY = e.pageY;
            // },
            // 'mouseup': function() {
            //     clicked = false;
            //     $('html').css('cursor', 'auto');
            // },
        });

        var updateScrollPos = function(e) {
            $('html').css('cursor', 'row-resize');
            $(window).scrollTop($(window).scrollTop() + (clickY - e.pageY));
            $(window).scrollLeft($(window).scrollLeft() + (clickX - e.pageX));



        }
        var updateResize = function(e) {
            $('html').css('cursor', 'row-resize');
            $(window).resize($(window).resize() + (clickY - e.pageY));

        }

    }
    this.closeDrag = function() {
        // $(document).off('mousemove').off('mousedown').off('mouseup');
        $('#pdf-container').off('touchstart').off('touchmove').off('touchend');
    }
}

function movePDF(check) {
    let x = document.getElementsByClassName("lower-canvas");
    for (let i = 0; i < x.length; i++) {
        if (check == true) {
            x[i].style.pointerEvents = "none";
        } else {
            x[i].style.pointerEvents = "auto";
        }

    }
    let y = document.getElementsByClassName("upper-canvas");
    for (let i = 0; i < y.length; i++) {
        if (check == true) {
            y[i].style.pointerEvents = "none";
        } else {
            y[i].style.pointerEvents = "auto";
        }
    }
}

PDFAnnotate.prototype.enableMove = function() {
    movePDF(true);

}






PDFAnnotate.prototype.enableSelector = function() {
    movePDF(false);
    var inst = this;
    inst.active_tool = 0;
    inst.openDrag()
    if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function(index, fabricObj) {
            fabricObj.isDrawingMode = false;
        });
    }

}

PDFAnnotate.prototype.enablePencil = function() {
    movePDF(false);
    var inst = this;
    inst.active_tool = 1;
    inst.closeDrag()
    if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function(index, fabricObj) {
            fabricObj.isDrawingMode = true;
        });
    }
}

PDFAnnotate.prototype.enableAddText = function() {
    movePDF(false);
    var inst = this;
    inst.active_tool = 2;
    if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function(index, fabricObj) {
            fabricObj.isDrawingMode = false;
        });
    }
}
PDFAnnotate.prototype.enableAddImage = function() {
    movePDF(false);
    var inst = this;
    inst.active_tool = 5;
    inst.openDrag()
    alert("接下來可以點選任何位置新增圖片喔")
    if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function(index, fabricObj) {
            fabricObj.isDrawingMode = false;
        });
    }
}

PDFAnnotate.prototype.enableRectangle = function() {
    movePDF(false);
    var inst = this;
    var fabricObj = inst.fabricObjects[inst.active_canvas];
    inst.active_tool = 4;
    if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function(index, fabricObj) {
            fabricObj.isDrawingMode = false;
        });
    }

    var rect = new fabric.Rect({
        width: 100,
        height: 100,
        fill: inst.color,
        stroke: inst.borderColor,
        strokeSize: inst.borderSize
    });
    fabricObj.add(rect);
}

PDFAnnotate.prototype.enableAddArrow = function() {
    movePDF(false);
    var inst = this;
    inst.active_tool = 3;
    if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function(index, fabricObj) {
            fabricObj.isDrawingMode = false;
            new Arrow(fabricObj, inst.color, function() {
                inst.active_tool = 0;
            });
        });
    }
}

PDFAnnotate.prototype.deleteSelectedObject = function() {
    movePDF(false);
    var inst = this;
    // var activeObject = inst.fabricObjects[inst.active_canvas].getActiveObject();
    // if (activeObject) {
    //     if (confirm('確定清除?')) inst.fabricObjects[inst.active_canvas].remove(activeObject);
    // }

    if (confirm('確定清除此物件嗎？')) {
        for (let i = 0; i < inst.fabricObjects.length; i++) {
            let activeObject = inst.fabricObjects[i].getActiveObject();
            if (activeObject) {
                inst.fabricObjects[i].remove(activeObject);
            }
        }

    }
}

PDFAnnotate.prototype.savePdf = function() {
    var inst = this;
    var doc = new jsPDF("l", "pt", 'a4', true);
    doc.deletePage(1);
    const devicePixelRatio = window.devicePixelRatio || 1;
    console.log(devicePixelRatio) // 2 -> 3
        // const devicePixelRatio = 4;
        // var width = doc.internal.pageSize.getWidth();
        // var height = doc.internal.pageSize.getHeight();
    $.each(inst.fabricObjects, function(index, fabricObj) {

        var wid_real = inst.width;
        // console.log(wid_real) // actual size 728
        console.log(fabricObj.width) // 1280 -> 280



        // var raw_width = Math.floor(width / devicePixelRatio);
        // var raw_height = Math.floor(height / devicePixelRatio);
        if (index != 0) {
            doc.setPage(index + 1);
        }

        let scaleRatioWidth = wid_real / fabricObj.width;
        console.log(scaleRatioWidth) //0.56785 -> 2.6
        fabricObj.setHeight(fabricObj.height * scaleRatioWidth);
        fabricObj.setWidth(fabricObj.width * scaleRatioWidth);
        var objects = fabricObj.getObjects(); // 自己新增的文字圖片等等
        for (var i in objects) {
            objects[i].scaleX = objects[i].scaleX * scaleRatioWidth;
            objects[i].scaleY = objects[i].scaleY * scaleRatioWidth;
            objects[i].left = objects[i].left * scaleRatioWidth;
            objects[i].top = objects[i].top * scaleRatioWidth;
            objects[i].setCoords();
        }
        var obj = fabricObj.backgroundImage;
        console.log(obj.width)
        console.log(obj.height)
        if (obj) {
            obj.scaleX = obj.scaleX * scaleRatioWidth;
            obj.scaleY = obj.scaleY * scaleRatioWidth;
        }
        fabricObj.renderAll();
        fabricObj.calcOffset();

        // var width = fabricObj.width;
        // var height = fabricObj.height;
        var width = inst.width;
        var height = inst.height;
        console.log(width)
        console.log(height);




        doc.addPage(width, height);
        let imgData = fabricObj.toDataURL('image/png')
        doc.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');
    });
    var blob = doc.output('blob');
    // var formData = new FormData();
    // formData.append('pdf', blob);
    let storageRef = inst.storageRef;
    let databaseRef = inst.dataRef;
    let metadata = {
        pdfFile: 'application/pdf'
    };
    updates_data = {}
    firebase.storage().ref(storageRef).put(blob, metadata).then(function(snapshot) {
        snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("save storage")
                // eventData.schedule.raw.memo = downloadURL
            updates_data['rent_pdf'] = downloadURL
                //one for now rent data and another for history
            firebase.database().ref(databaseRef).update(updates_data).then(function() {


                firebase.database().ref(databaseRef).once('value').then((snapshot) => {
                    if (snapshot.exists()) {

                        var rent_house_name = (snapshot.val() && snapshot.val().rent_house_name) || '無';
                        var rent_room_name = (snapshot.val() && snapshot.val().rent_room_name) || '無';
                        let send_link = "https://us-central1-taipeimetrohouse.cloudfunctions.net/sendContractFinishMail?house=" +
                            rent_house_name + '&room=' + rent_room_name + '&url='
                        if (rent_house_name != "None") {
                            $.ajax({
                                url: send_link,
                                type: 'GET',
                                success: function() {
                                    doc.save(rent_house_name + rent_room_name + '.pdf');
                                    $("#uploadModal .close").click();
                                    $('#dataUploadModal').modal();
                                },
                                fail: function(xhr, textStatus, errorThrown) {
                                    alert('成功儲存但未通知房東(網路錯誤)');
                                }
                            });
                        }

                    } else {
                        alert('成功儲存(資料錯誤)')
                    }
                }).catch((error) => {
                    console.error(error);
                });
                // let send_link = "https://us-central1-housebeauty-6ab4a.cloudfunctions.net/sendMail?dest=" +
                //     room_email + '&username=' + room_person + '&house=' + house_name + '&url=' + "https://housebeauty-6ab4a.firebaseapp.com/pdf.html" + "&stref=" + storageRef + "&dataref=" + databaeRef

                // $.ajax({
                //     url: send_link,
                //     type: 'GET',
                //     success: function() {
                //         let invite_data = {}
                //         invite_data['rent_anonymous'] = true


                //     }
                // });
            }).catch(function(error) {
                alert(error);
            });
        });
    });
}

PDFAnnotate.prototype.setBrushSize = function(size) {
    var inst = this;
    $.each(inst.fabricObjects, function(index, fabricObj) {
        fabricObj.freeDrawingBrush.width = size;
    });
}

PDFAnnotate.prototype.setColor = function(color) {
    var inst = this;
    inst.color = color;
    $.each(inst.fabricObjects, function(index, fabricObj) {
        fabricObj.freeDrawingBrush.color = color;
    });
}

PDFAnnotate.prototype.setBorderColor = function(color) {
    var inst = this;
    inst.borderColor = color;
}

PDFAnnotate.prototype.setFontSize = function(size) {
    this.font_size = size;
}

PDFAnnotate.prototype.setBorderSize = function(size) {
    this.borderSize = size;
}

PDFAnnotate.prototype.clearActivePage = function() {
    var inst = this;
    if (confirm('確定清空嗎？')) {
        for (let i = 0; i < inst.fabricObjects.length; i++) {
            let fabricObj = inst.fabricObjects[i];
            let bg = fabricObj.backgroundImage;
            fabricObj.clear();
            fabricObj.setBackgroundImage(bg, fabricObj.renderAll.bind(fabricObj));
        }

    }

    // var fabricObj = inst.fabricObjects[inst.active_canvas];
    // var bg = fabricObj.backgroundImage;
    // if (confirm('確定清空嗎？')) {
    //     fabricObj.clear();
    //     fabricObj.setBackgroundImage(bg, fabricObj.renderAll.bind(fabricObj));
    // }
}

PDFAnnotate.prototype.serializePdf = function() {
    var inst = this;
    return JSON.stringify(inst.fabricObjects, null, 4);
}



PDFAnnotate.prototype.loadFromJSON = function(jsonData) {
        var inst = this;
        $.each(inst.fabricObjects, function(index, fabricObj) {
            if (jsonData.length > index) {
                fabricObj.loadFromJSON(jsonData[index], function() {
                    inst.fabricObjectsData[index] = fabricObj.toJSON()
                })
            }
        })
    }
    //read user upload image
function readURL(input) {
    if (!input) {
        alert("找不到檔案");
        return;
    } else if (!input.files) {
        alert("不支援的檔案類型");
        return
    }

    imageFile = input.files[0];

    // if (imageFile.size > 10485760) {
    //     alert("請選擇小於10MB的圖檔");
    //     return
    // }
    const validImageTypes = ['image/jpeg', 'image/png'];

    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileType = file['type'];

        if (input.files[0]) {}

        if (!validImageTypes.includes(fileType)) {
            alert("請選擇圖檔");
            return;
        }
        return input.files[0];
    }
}