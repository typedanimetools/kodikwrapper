import {
  AllowArray,
  BlockedSeasonsObject,
  FilterByAnotherDatabase,
  MaterialData,
  ReleaseType,
  SeasonsObject,
  Translation,
  TranslationType,
} from "./types";

export interface ListParams extends FilterByAnotherDatabase {
  /**
   * Количество материалов, выводимое за один раз.
   */
  limit?: number;
  /**
   * По какому полю сортировать материалы.
   */
  sort?:
    | "year"
    | "created_at"
    | "updated_at"
    | "kinopoisk_rating"
    | "imdb_rating"
    | "shikimori_rating";
  /**
   * Направление сортировки
   *
   * `asc` (по возрастанию), `desc` (по убыванию)
   */
  order?: "asc" | "desc";
  /**
   * Фильтрация материалов по их типу. Для удобства доступно большое количество типов фильмов и сериалов. Необходимые типы указываются через запятую
   *
   * Фильмы: foreign-movie, soviet-cartoon, foreign-cartoon, russian-cartoon, anime, russian-movie
   *
   * Сериалы: cartoon-serial, documentary-serial, russian-serial, foreign-serial, anime-serial, multi-part-film
   */
  types?: AllowArray<ReleaseType>;
  /**
   * Фильтрация материалов по году. Если указать этот параметр, то будут выведены только материалы соответствующего года
   */
  year?: number;
  /**
   * Фильтрация материалов по ID озвучки. ID всех озвучек можно получить через API ресурс /translations либо на странице списка озвучек.
   */
  translation_id?: AllowArray<number>;
  /**
   * Фильтрация материалов по типу перевода. Позволяет выводить только голосовой перевод или только субтитры.
   */
  translation_type?: TranslationType;
  /**
   * 	Фильтрация материалов по параметру camrip. Если указать false, то будут выведены только материалы с качественной картинкой. Если не указывать этот параметр, то будут выведены все материалы.
   */
  camrip?: boolean;
  /**
   * Если указать true, вместе с сериалами в поле seasons также будут перечислены сезоны сериала. Этот и следующий параметр сделаны для того, чтобы не перегружать вывод материалов огромным количеством информации о сезонах и сериях, если эта информация не нужна при парсинге.
   */
  with_seasons?: boolean;
  /**
   * Если указать true, то к каждому сериалу будет добавлено поле seasons (даже если with_seasons не указано или указано как false) и к каждому сезону будет добавлено поле episodes с сериями этого сезона. При использовании параметра with_episodes номерам серий будут соответсовать обычные ссылки серий.
   */
  with_episodes?: boolean;
  /**
   * При использовании with_episodes_data номерам будут соотвествовать объекты серий, где ссылка будет доступна через link параметр, название серии (при его наличии) через title параметр, а кадры через screenshots
   */
  with_episodes_data?: boolean;
  /**
   * 	Если указать true, то все ссылки на плееры будут заменены на специальные ссылки на страницы с плеерами (подходят для случаев, когда у вас нет своего сайта). Настроить внешний вид этих страниц можно в настройках в базе. Если вместе с этим параметром будут указан параметр with_seasons или with_episodes / with_episodes_data, то в сезонах и сериях ссылки также будут заменены.
   */
  with_page_links?: boolean;
  /**
   * Фильтрация материалов по странам, в которых они не должны быть заблокированы. Коды стран указываются через запятую.
   */
  not_blocked_in?: AllowArray<string>;
  /**
   * 	Более простой аналог предыдущего параметра. Наш сервер сам проверяет с какой страны происходит текущий запрос и не выводит те материалы, которые для этой страны заблокированы. Данный параметр может пригодиться, если API вызывается через javascript на вашем сайте
   */
  not_blocked_for_me?: boolean;
  /**
   * Если указать true, к каждому фильму/сериалу будет добавлено поле material_data, содержащее информацию с КиноПоиска и Shikimori. Структура информации
   */
  with_material_data?: boolean;
}

export interface ListResponseObject {
  /**
   * Уникальный ID материала
   */
  id: string;
  /**
   * Тип материала
   */
  type: ReleaseType;
  /**
   * Ссылка на плеер
   */
  link: string;
  /**
   * Название
   */
  title: string;
  /**
   * Оригинальное название
   */
  title_orig: string;
  /**
   * Другое название (часто встречается в аниме)
   */
  other_title: string;
  /**
   * Объект содержащий id озвучки, title (название) и type (тип: voice или subtitles) озвучки.
   */
  translation: Translation;
  /**
   * Год
   */
  year: number;
  /**
   * Номер последнего сезона сериала. Поле присутствует только в материалах c типом сериала
   */
  last_season?: number;
  /**
   * Номер последнего эпизода сериала. Поле присутствует только в материалах c типом сериала
   */
  last_episode?: number;
  /**
   * Общее количество эпизодов в сериале. Поле присутствует только в материалах c типом сериала
   */
  episodes_count?: number;
  /**
   * ID кинопоиска
   */
  kinopoist_id: string;
  /**
   * ID IMDb
   */
  imdb_id: string;
  /**
   * ID MyDramaList
   */
  mdl_id: string;
  /**
   * Ссылка на материал на world art (Используется не ID, так как на world art есть разные разделы с независимыми ID)
   */
  worldart_link: string;
  /**
   * ID Shikimori (только цифры)
   */
  shikimori_id: string;
  /**
   * Является ли материал камрипом
   */
  camrip: boolean;
  /**
   * Качество видео.
   */
  quality: string;
  /**
   * Массив, содержащий страны, в которых материал заблокирован. Либо пустой массив, если материал не заблокирован нигде.
   */
  blocked_countries: string[];
  /**
   * Если сериал заблокирован целиком, то поле содержит строку "all", если заблокированы отдельные сезоны, то поле явлется объектом и содержит номера сезонов и к каждом сезону: либо "all" (если заблокированы все эпизоды), либо массив из номеров серий ["1", "2", "3"] (если заблокированы отдельные серии). Если ничего не заблокировано, поле является пустым объектом. Поле присутствует только в материалах c типом сериала
   */
  blocked_seasons?: BlockedSeasonsObject | "all";
  /**
   * Объект с сезонами и с сериями в них. Поле присутствует только если в запросе были указаны параметры with_seasons или with_episodes / with_episodes_data
   */
  seasons?: SeasonsObject;
  /**
   * При отсутствии информации кинопоиска, shikimori и mydramalist для какого-либо материала, поле material_data будет отсуствовать.
   *
   * При отсутствии какой-то части информации внутри поля material_data, данное поле будет отсутствовать. Например при отстутсвии информации об актерах, поле actors будет отсутствовать
   */
  material_data: MaterialData;
  /**
   * Дата создания материала. Указывается в формате ISO 8601
   */
  created_at: string;
  /**
   * Дата обновления материала. Указывается в формате ISO 8601
   */
  updated_at: string;
  /**
   * Ссылки на кадры из видео. Для сериалов в основной информации выводятся кадры из первой серии. Для получения кадров каждой серии, нужно использовать параметр with_episodes_data, который описан выше
   */
  screenshots: string[];
}

export interface ListResponse {
  time: string;
  total: number;
  prev_page: null;
  next_page: string;
  results: ListResponseObject[];
}
