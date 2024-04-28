### planlanan:
    * 
    * tüm ana kategorileri listelemek için => "parentCategoryIds": []
    * bazı kategorilerin birden fazla parentı olabilir.Ona göre create yap

### yapılan:
    * permissions aktif
    * kategoriler alt ve üst kategorilere sahiptir.
    * admin kendini silemez
    * admin hariç herkes kendini silebilir
    * kullanıcı silinince tokenı da silinir ve login de olamaz((user.isActive && !user.isDeleted))
    * silinenleri admin görebilir ayrıca listeleyebilir.
    * Admin olmayan isAdmin durumunu değiştiremez
    * Bir kullanıcının başka bir kullanıcıyı güncellemesini engelle (admin güncelleyebilir):
    * bir kullanıcının başka bir kullanıcıyı silmesi engellenir:
    * user soft delete işlemi
    * category güncelleme ve silme sadece adminde


1)  https://github.com/sahandghavidel/mern-blog
    https://www.youtube.com/watch?v=Kkht2mwSL_I

2)  https://github.com/mohammadrz003/moonfo-youtube/tree/mern-stack-blog-backend
    https://www.youtube.com/watch?v=8bWU_GcFb90&list=PLhaS1k1mPiCO878vo-9xFJAlUfcz9dMv2


3) https://github.com/snehasishdey333/youtube-2023/tree/blog-app-mern/backend/models
    https://www.youtube.com/watch?v=zuye-dYSkS0

4) 