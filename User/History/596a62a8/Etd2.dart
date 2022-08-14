import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:icon_badge/icon_badge.dart';
import 'package:mallxx_app/app/routes/app_pages.dart';
import '../../../components/search_header.dart';
import '/app/models/newcategory_model.dart';
import '/app/modules/root/controllers/category_controller.dart';

class CategoryView extends GetView<CategoryController> {
  Widget _leftMenuList() {
    var categorys = controller.categoryList.value;
    int clickSelectIndex = controller.clickSelectIndex.value;
    return ListView.builder(
      padding: const EdgeInsets.only(top: 10.0),
      physics: const NeverScrollableScrollPhysics(),
      itemCount: categorys.length,
      itemBuilder: (context, index) {
        AreaList item = categorys[index];
        if (index == clickSelectIndex) {
          item.select = true;
        }
        return InkWell(
          onTap: () {
            controller.setListStatus(index);
          },
          child: Container(
            color: Colors.grey[100],
            height: 50,
            alignment: Alignment.center,
            width: 50,
            child: Flex(
              direction: Axis.horizontal,
              children: [
                Expanded(
                  flex: 1,
                  child: Container(
                    height: 15,
                    color: item.select ? Colors.red : Colors.grey[100],
                  ),
                ),
                Expanded(
                  flex: 30,
                  child: Container(
                    alignment: Alignment.center,
                    child: Text(
                      categorys[index].name!,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: item.select ? Colors.black : Colors.black54,
                        fontWeight:
                            item.select ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                  ),
                )
              ],
            ),
          ),
        );
      },
    );
  }

  Widget categoryTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 10.0),
      child: Text(
        title,
        style: const TextStyle(fontSize: 15.0, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _childrenCategory() {
    var category = controller.categoryChildren.value;
    int clickSelectIndex = controller.clickSelectIndex.value;
    if (category.isEmpty) {
      return Container();
    }

    List<ArticleList> children = category;
    int len = children.length;
    if (len <= 0) {
      return Container();
    }

    return Container(
      margin: const EdgeInsets.only(top: 10.0, left: 5, right: 5, bottom: 0),
      // height: 12,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(
          Radius.circular(10),
        ),
      ),
      child: ListView.builder(
          padding: const EdgeInsets.symmetric(10.0, 5),
          itemCount: len,
          // controller: ,
          physics: const NeverScrollableScrollPhysics(),
         /* gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 5.0,
            crossAxisSpacing: 5.0,
          ),*/
          itemBuilder: (context, index) {
            ArticleList item = children[index];
            return InkWell(
              highlightColor: Colors.white24,
              hoverColor: Colors.white24,
              focusColor: Colors.white24,
              onTap: () {
                /*Get.toNamed(Routes.PRODUCT_LIST, arguments: {
                  "name": item.title,
                  "id": item.id,
                });*/
                Get.toNamed(
                  Routes.LAND_LIST,
                  //arguments: {"id": item.id!},
                );
              },
              child: Container(
                // margin: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: const BorderRadius.all(
                    Radius.circular(10),
                  ),
                ),
                alignment: Alignment.center,
                height: 220,
                width: 100,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (item.image != null && item.image!.length > 0)
                      Image(
                        image: NetworkImage(item.image!),
                        height: 200.0,
                        width: double.infinity,
                        fit: BoxFit.fill,
                      ),
                    Padding(
                      padding: const EdgeInsets.all(1.0),
                      child: Text(
                        item.title!,
                        style: const TextStyle(
                          color: Colors.black87,
                        ),
                      ),
                    )
                  ],
                ),
              ),
            );
          }),
    );
  }

  // Widget _categoryAdvertisement() {
  //   return InkWell(
  //     onTap: () {},
  //     highlightColor: const Color(0xfffbfbfb),
  //     child: Container(
  //       width: double.infinity,
  //       height: 100,
  //       margin: const EdgeInsets.only(left: 5.0, right: 5.0),
  //       decoration: BoxDecoration(
  //         image: DecorationImage(
  //           image: NetworkImage(
  //             "https://img.alicdn.com/tps/i4/TB1l573vlv0gK0jSZKbSuvK2FXa.jpg_490x490q100.jpg_.webp",
  //           ),
  //           fit: BoxFit.fill,
  //         ),
  //         borderRadius: BorderRadius.circular(10.0),
  //       ),
  //     ),
  //   );
  // }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      /*appBar: AppBar(
        centerTitle: true,
        title: Text('category'.tr),
      ),*/
      appBar: AppBar(
        centerTitle: true,
        leading: Image.asset("assets/icons/logo.png"), //logo
        actions: [
          IconBadge(
            icon: const Icon(
              Icons.notifications_none,
              size: 30,
            ),
            itemCount: 100,
            badgeColor: Colors.red,
            itemColor: Colors.white,
            maxCount: 99,
            hideZero: true,
            onTap: () {
              //Get.toNamed(Routes.MESSAGE_CENTER);
            },
          ),
        ],
        title: GestureDetector(
          onDoubleTap: () {
            // _easyRefreshController.
          },
          child: const SearchHeader(),
        ),
      ),
      body: Obx(() {
        if (controller.isLoding.isFalse) {
          var categorys = controller.categoryList.value;
          int clickSelectIndex = controller.clickSelectIndex.value;

          if (categorys.isEmpty) {
            return Container();
          }
          List<AreaList> item = categorys;
          int l = item.length;
          int? c = (l / 3.0).ceil();
          double height = (100 * c.toDouble()) + (c <= 1 ? 20 : 10);
          print(height);
          return Row(
            children: [
              Container(
                color: Colors.grey[100],
                width: 90,
                height: MediaQuery.of(context).size.height,
                child: _leftMenuList(),
              ),
              Expanded(
                child:  _childrenCategory()//ListView(
                  /*padding: const EdgeInsets.only(top: 10.0),
                  children: [
                    // _categoryAdvertisement(),
                    //categoryTitle("热门推荐"),

                    SizedBox(
                      child: _childrenCategory(),
                      height: height,
                    )
                  ],
                ),*/
               // flex: 4,
              ),
            ],
          );
        } else {
          return Center(
            child: CircularProgressIndicator(),
          );
        }
      }),
    );
  }
}
